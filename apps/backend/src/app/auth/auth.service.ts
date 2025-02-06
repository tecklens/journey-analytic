import {ConflictException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException,} from '@nestjs/common';
import {
  ActivityType,
  AuthProviderEnum,
  IJwtPayload,
  IUser,
  IUserResetTokenCount,
  MemberStatus,
  ROLES,
  UserId,
  UserPlan,
  UserStatus,
  UserInfoDto,
} from '@journey-analytic/shared';
import {differenceInHours, differenceInMinutes, differenceInSeconds, isBefore, parseISO, subDays,} from 'date-fns';
import {
  MemberEntity,
  MemberRepository,
  ProjectEntity,
  ProjectRepository,
  UserActivityRepository,
  UserEntity,
  UserRepository,
} from '../../repositories/maria';
import {JwtService} from '@nestjs/jwt';
import {LoginBodyDto, PasswordResetBodyDto, UserRegistrationBodyDto,} from './dtos';
import * as bcrypt from 'bcrypt';
import {Cache, CACHE_MANAGER, CacheKey} from '@nestjs/cache-manager';
import * as process from 'process';
import {Transactional} from 'typeorm-transactional';
import {IFingerprint} from 'nestjs-fingerprint';
import {InjectQueue} from '@nestjs/bullmq';
import {Queue} from 'bullmq';
import {ApiException, buildUserKey, MailPayload, makeid, normalizeEmail} from "../../types";

@Injectable()
export class AuthService {
  private MAX_ATTEMPTS_IN_A_MINUTE = 5;
  private MAX_ATTEMPTS_IN_A_DAY = 15;
  private RATE_LIMIT_IN_SECONDS = 60;
  private RATE_LIMIT_IN_HOURS = 24;

  private BLOCKED_PERIOD_IN_MINUTES = 5;
  private MAX_LOGIN_ATTEMPTS = 5;

  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly memberRepository: MemberRepository,
    private readonly userActivityRepository: UserActivityRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('send-email') private emailQueue: Queue<MailPayload, any, any>,
  ) {
  }

  public async validateUser(payload: IJwtPayload): Promise<IUser> {
    // We run these in parallel to speed up the query time
    const user = await this.getUser({id: payload.id});

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  @Transactional()
  public async authenticateGoogle(
    authProvider: AuthProviderEnum,
    accessToken: string,
    refreshToken: string | undefined,
    profile: {
      id: string;
      displayName: string;
      name: {
        familyName: string;
        givenName: string;
      };
      emails: { value: string; verified: boolean }[];
      photos: { value: string }[];
    },
  ): Promise<{ newUser: boolean; token: string; refreshToken: string }> {
    const {name, emails, photos} = profile;
    const email = normalizeEmail(emails[0].value);
    let user: UserEntity | null = await this.userRepository.findByEmail(email);
    let newUser = false;

    if (!user) {
      const firstName = name.givenName;
      const lastName = name.familyName;

      user = await this.userRepository.save({
        profilePicture: photos[0].value,
        username: email,
        email,
        firstName,
        lastName,
        plan: UserPlan.free,
        billingCode: makeid(10).toUpperCase(),
        status: UserStatus.PENDING,
        tokens: [
          {
            provider: authProvider,
            token: accessToken,
            refreshToken,
            valid: true,
          },
        ],
      });

      await this.createProject({
        userId: user.id,
        name: email,
      });

      newUser = true;
    } else {
      if (authProvider === AuthProviderEnum.GOOGLE) {
        if (user.status === UserStatus.PENDING) newUser = true;
        user = await this.updateUserUsername(
          user,
          {
            email: email,
            name: profile.displayName,
            avatar_url: profile.photos[0].value,
            login: email,
            id: profile.id,
          },
          authProvider,
        );
      }

      // this.analyticsService.track('[Authentication] - Login', user._id, {
      //   loginType: authProvider,
      // });
    }

    return {
      newUser,
      ...(await this.generateUserToken({
        user,
        type: newUser ? ActivityType.REGISTER : ActivityType.SIGN_IN_GG,
      })),
    };
  }

  public async generateUserToken({
                                   user,
                                   fp,
                                   type,
                                 }: {
    user: IUser;
    fp?: IFingerprint;
    type?: ActivityType;
  }): Promise<{ token: string; refreshToken: string }> {
    const members = await this.memberRepository.findUserActiveMembers(user.id);
    const projects = await this.projectRepository.findUserActiveProjects(
      members.map((e) => e.projectId),
    );

    if (!projects || projects.length === 0) {
      throw new ConflictException('Bạn đang không thuộc cửa hàng nào');
    }

    let project: ProjectEntity | undefined = undefined;
    if (user.currentProjectId) {
      project = projects.find((e: ProjectEntity) => e.id === user.currentProjectId);
    }

    if (!project) project = projects[0];

    const member = members.find((e) => e.projectId === project.id);

    if (!member) throw new NotFoundException('You are not a member of this project');

    try {
      await this.userActivityRepository.save({
        userId: user.id,
        projectId: project?.id,
        fingerprintId: fp?.id,
        headers: JSON.stringify(fp?.headers ?? ''),
        userAgent: JSON.stringify(fp?.userAgent ?? ''),
        type: type ?? ActivityType.SIGN_IN,
        os: JSON.stringify(fp?.os ?? ''),
        ip: fp?.ipAddress?.value,
      });
    } catch (e) {
      Logger.debug(e);
    }

    return this.getSignedToken(
      user,
      project.id,
      member,
    );
  }

  public async getSignedToken(
    user: IUser | IJwtPayload,
    projectId: string,
    member: MemberEntity,
  ): Promise<{ token: string; refreshToken: string; expiresIn: number }> {
    const roles: string[] = [];
    if (member && member.roles) {
      roles.push(...member.roles);
    }

    const expiresIn = 14400; // 2 hours

    return {
      token: this.jwtService.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          plan: user.plan,
          projectId: projectId,
          roles,
        },
        {
          expiresIn: expiresIn,
          issuer: 'ja_api',
        },
      ),
      expiresIn,
      refreshToken: await this.generateRefreshToken(
        user,
        projectId,
        roles,
      ),
    };
  }

  async generateRefreshToken(
    user: IUser | IJwtPayload,
    projectId: string,
    roles: string[],
  ) {
    const expiresIn = 172800; // 2d
    const newRefreshToken = this.jwtService.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        plan: user.plan,
        projectId: projectId,
        roles,
      },
      {expiresIn: expiresIn, issuer: 'dhn_api', secret: process.env.REFRESH_TOKEN_SECRET ?? 'ja_rf'},
    );

    await this.cacheManager.set(
      `refresh_token_${user.id}_${projectId}`,
      newRefreshToken,
      expiresIn, // 2d
    );

    return newRefreshToken;
  }

  async generateTokenPair(user: IJwtPayload) {
    const expiresIn = 14400; // 2 hours

    return {
      token: this.jwtService.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          plan: user.plan,
          projectId: user.projectId,
          roles: user.roles,
        },
        {
          expiresIn,
          issuer: 'real_estate_api',
        },
      ),
      expiresIn,
    };
  }

  @Transactional()
  async userRegistration(
    u: IJwtPayload,
    body: UserRegistrationBodyDto,
    fp: IFingerprint,
  ) {
    if (process.env.DISABLE_USER_REGISTRATION == 'true')
      throw new ApiException('Account creation is disabled');

    const email = normalizeEmail(body.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ApiException('User already exists');

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await this.userRepository.save({
      email,
      username: email,
      phoneNumber: body.phoneNumber,
      firstName: body.firstName,
      lastName: body.lastName,
      password: passwordHash,
      plan: UserPlan.free,
      billingCode: makeid(10).toUpperCase(),
      status: UserStatus.ACTIVE,
    });

    const {project} = await this.createProject({
      userId: user.id,
      name: body.projectName,
      createdBy: user.id,
    });

    try {
      await this.userActivityRepository.save({
        userId: user.id,
        projectId: project.id,
        fingerprintId: fp.id,
        headers: JSON.stringify(fp.headers),
        userAgent: JSON.stringify(fp.userAgent),
        type: ActivityType.REGISTER,
        os: JSON.stringify(fp.os),
        ip: fp.ipAddress.value,
      });
    } catch (e) {
      Logger.debug(e);
    }

    return {
      ...(await this.generateUserToken({
        user,
        type: ActivityType.REGISTER,
      })),
    };
  }

  private async createProject(body: any) {
    const defaultRoles = [ROLES.superuser];
    const project = await this.projectRepository.save(body);

    const member = await this.addMember({
      projectId: project.id,
      userId: body.userId,
      isDefault: true,
      roles: defaultRoles,
    });

    return {
      project,
      member,
    };
  }

  private async addMember({
                            projectId,
                            userId,
                            roles,
                            isDefault,
                          }: {
    projectId: string;
    userId: string;
    roles: string[];
    isDefault: boolean;
  }) {
    const isAlreadyMember = await this.isMember(userId, projectId);
    if (isAlreadyMember) throw new ApiException('Member already exists');

    return await this.memberRepository.addMember(
      projectId,
      {
        userId: userId,
        roles: roles,
        memberStatus: MemberStatus.ACTIVE,
      },
      isDefault,
    );
  }

  private async isMember(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    return !!(await this.memberRepository.findMemberByUserId(
      projectId,
      userId,
    ));
  }

  private getRandomNumberString() {
    return Math.floor(100000 + Math.random() * 900000).toString(10);
  }

  public async resetPassword(d: { email: string }) {
    const email = normalizeEmail(d.email);
    const foundUser = await this.userRepository.findByEmail(email);
    if (foundUser && foundUser.email) {
      const {error, isBlocked} = this.isRequestBlocked(foundUser);
      if (isBlocked) {
        throw new UnauthorizedException(error);
      }
      const otpToken = this.getRandomNumberString();

      await this.cacheManager.del(
        buildUserKey({
          _id: foundUser.id,
        }),
      );

      const resetTokenCount = this.getUpdatedRequestCount(foundUser);
      await this.userRepository.updatePasswordResetToken(
        foundUser.id,
        otpToken,
        resetTokenCount,
      );

      if (process.env.ALLOW_RESET_PASSWORD == 'true') {
        await this.emailQueue
          .add('send', {
            to: email,
            from: '"DHN" <support@donghangnhanh.vn>',
            subject:
              process.env.SUBJECT_RESET_PASSWORD ??
              'Đặt lại mật khẩu DHN của bạn',
            template: './send-forgot-password.html',
            context: {
              otp: otpToken,
            },
          })
          .catch((err) => {
            console.error(err);
          });
      }

      return {
        success: true,
      };
    }
  }

  public async passwordReset(d: PasswordResetBodyDto) {
    const user = await this.userRepository.findUserByToken(d.otp);
    if (!user) {
      throw new ApiException('Bad token provided');
    }

    if (
      user.resetTokenDate &&
      isBefore(new Date(user.resetTokenDate), subDays(new Date(), 7))
    ) {
      throw new ApiException('Token has expired');
    }

    const passwordHash = await bcrypt.hash(d.password, 10);

    await this.cacheManager.del(
      buildUserKey({
        _id: user.id,
      }),
    );

    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        password: passwordHash,
      },
    );

    if (user?.failedLogin && user?.failedLogin?.times > 0) {
      await this.resetFailedAttempts(user);
    }
    return {
      ...(await this.generateUserToken({
        user,
        type: ActivityType.PASS_RESET,
      })),
    };
  }

  public async login(d: LoginBodyDto, fp: IFingerprint) {
    const email = normalizeEmail(d.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      /**
       * maxWaitTime and minWaitTime(millisecond) are used to mimic the delay for server response times
       * received for existing users flow
       */
      const maxWaitTime = 110;
      const minWaitTime = 90;
      const randomWaitTime = Math.floor(
        Math.random() * (maxWaitTime - minWaitTime) + minWaitTime,
      );
      await new Promise((resolve) => setTimeout(resolve, randomWaitTime)); // will wait randomly for the chosen time to sync response time

      throw new UnauthorizedException(
        'Sai email hoặc mật khẩu. Vui lòng đăng nhập lại.',
      );
    }

    if (this.isAccountBlocked(user) && user.failedLogin) {
      const blockedMinutesLeft = this.getBlockedMinutesLeft(
        user.failedLogin.lastFailedAttempt,
      );
      throw new UnauthorizedException(
        `Account blocked, Please try again after ${blockedMinutesLeft} minutes`,
      );
    }

    // *: Trigger a password reset flow automatically for existing OAuth users instead of throwing an error
    if (!user.password) throw new ApiException('Please sign in using Google.');

    const isMatching = await bcrypt.compare(d.password, user.password);
    if (!isMatching) {
      const failedAttempts = await this.updateFailedAttempts(user);
      const remainingAttempts = this.MAX_LOGIN_ATTEMPTS - failedAttempts;

      if (remainingAttempts === 0 && user.failedLogin) {
        const blockedMinutesLeft = this.getBlockedMinutesLeft(
          user.failedLogin.lastFailedAttempt,
        );
        throw new UnauthorizedException(
          `Account blocked, Please try again after ${blockedMinutesLeft} minutes`,
        );
      }

      if (remainingAttempts < 3) {
        throw new UnauthorizedException(
          `Sai email hoặc mật khẩu. Vui lòng đăng nhập lại.`,
        );
      }

      throw new UnauthorizedException(
        `Sai email hoặc mật khẩu. Vui lòng đăng nhập lại.`,
      );
    }

    return {
      ...(await this.generateUserToken({user, fp})),
      user: UserInfoDto.fromEntity(user, []),
    };
  }

  @CacheKey('user:by-id')
  private async getUser({id}: { id: UserId }) {
    return await this.userRepository.findOneBy({
      id,
      status: UserStatus.ACTIVE,
    });
  }

  private async updateUserUsername(
    user: UserEntity,
    profile: {
      name: string;
      login: string;
      email: string;
      avatar_url: string;
      id: string;
    },
    authProvider: AuthProviderEnum,
  ): Promise<UserEntity> {
    const withoutUsername = user.tokens?.find(
      (token) =>
        token.provider === authProvider &&
        String(token.providerId) === String(profile.id),
    );

    if (withoutUsername) {
      await this.userRepository.update(
        {
          id: user.id,
        },
        {
          username: profile.login,
          profilePicture: profile.avatar_url,
        },
      );

      const newUser = await this.userRepository.findOneBy({
        id: user.id,
      });
      if (!newUser) throw new ApiException('User not found');

      return newUser;
    }

    return user;
  }

  private isRequestBlocked(user: IUser) {
    const lastResetAttempt = user.resetTokenDate;

    if (!lastResetAttempt) {
      return {
        isBlocked: false,
        error: '',
      };
    }
    // @ts-ignore
    const formattedDate = parseISO(lastResetAttempt);
    const diffSeconds = differenceInSeconds(new Date(), formattedDate);
    const diffHours = differenceInHours(new Date(), formattedDate);

    const withinDailyLimit = diffHours < this.RATE_LIMIT_IN_HOURS;
    const exceededDailyAttempt = user?.resetTokenCount
      ? user?.resetTokenCount?.reqInDay >= this.MAX_ATTEMPTS_IN_A_DAY
      : false;
    if (withinDailyLimit && exceededDailyAttempt) {
      return {
        isBlocked: true,
        error: `Too many requests, Try again after ${this.RATE_LIMIT_IN_HOURS} hours.`,
      };
    }

    const withinMinuteLimit = diffSeconds < this.RATE_LIMIT_IN_SECONDS;
    const exceededMinuteAttempt = user?.resetTokenCount
      ? user?.resetTokenCount?.reqInMinute >= this.MAX_ATTEMPTS_IN_A_MINUTE
      : false;
    if (withinMinuteLimit && exceededMinuteAttempt) {
      return {
        isBlocked: true,
        error: `Too many requests, Try again after a minute.`,
      };
    }

    return {
      isBlocked: false,
      error: '',
    };
  }

  private getTimeDiffForAttempt(lastFailedAttempt: string) {
    const now = new Date();
    const formattedLastAttempt = parseISO(lastFailedAttempt);
    return differenceInMinutes(now, formattedLastAttempt);
  }

  private getBlockedMinutesLeft(lastFailedAttempt: string) {
    const diff = this.getTimeDiffForAttempt(lastFailedAttempt);

    return this.BLOCKED_PERIOD_IN_MINUTES - diff;
  }

  private getUpdatedRequestCount(user: IUser): IUserResetTokenCount {
    const now = new Date().toISOString();
    const lastResetAttempt = user.resetTokenDate ?? now;
    // @ts-ignore
    const formattedDate = parseISO(lastResetAttempt);
    const diffSeconds = differenceInSeconds(new Date(), formattedDate);
    const diffHours = differenceInHours(new Date(), formattedDate);

    const resetTokenCount: IUserResetTokenCount = {
      reqInMinute: user.resetTokenCount?.reqInMinute ?? 0,
      reqInDay: user.resetTokenCount?.reqInDay ?? 0,
    };

    resetTokenCount.reqInMinute =
      diffSeconds < this.RATE_LIMIT_IN_SECONDS
        ? resetTokenCount.reqInMinute + 1
        : 1;
    resetTokenCount.reqInDay =
      diffHours < this.RATE_LIMIT_IN_HOURS ? resetTokenCount.reqInDay + 1 : 1;

    return resetTokenCount;
  }

  private async updateFailedAttempts(user: IUser) {
    const now = new Date();
    let times = user?.failedLogin?.times ?? 1;
    const lastFailedAttempt = user?.failedLogin?.lastFailedAttempt;

    if (lastFailedAttempt) {
      const diff = this.getTimeDiffForAttempt(lastFailedAttempt);
      times = diff < this.BLOCKED_PERIOD_IN_MINUTES ? times + 1 : 1;
    }

    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        failedLogin: {
          times,
          lastFailedAttempt: now.toISOString(),
        },
      },
    );

    return times;
  }

  private isAccountBlocked(user: IUser) {
    const lastFailedAttempt = user?.failedLogin?.lastFailedAttempt;
    if (!lastFailedAttempt) return false;

    const diff = this.getTimeDiffForAttempt(lastFailedAttempt);

    return (
      user?.failedLogin &&
      user?.failedLogin?.times >= this.MAX_LOGIN_ATTEMPTS &&
      diff < this.BLOCKED_PERIOD_IN_MINUTES
    );
  }

  private async resetFailedAttempts(user: IUser) {
    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        failedLogin: {
          times: 0,
        },
      },
    );
  }

  private async getUsersMembersProjectIds(
    userId: string,
  ): Promise<MemberEntity[]> {
    return await this.memberRepository.findUserActiveMembers(userId);
  }

  async switchProject({
                      newProjectId,
                      userId,
                    }: {
    newProjectId: string;
    userId: string;
  }) {
    const isAuthenticated = await this.isAuthenticatedForStore(
      userId,
      newProjectId,
    );
    if (!isAuthenticated) {
      throw new UnauthorizedException(
        `Not authorized for organization ${newProjectId}`,
      );
    }

    const project = await this.projectRepository.findByIdWithOwner(newProjectId);
    if (!project) {
      throw new NotFoundException('Store not exist');
    }

    const member = await this.memberRepository.findMemberByUserId(
      newProjectId,
      userId,
    );
    if (!member) throw new ApiException('Member not found');

    const user = await this.userRepository.findById(userId);
    if (!user) throw new ApiException(`User ${userId} not found`);

    await this.userRepository.updateCurrentProject(user.id, newProjectId);

    return await this.getSignedToken(
      user,
      newProjectId,
      member,
    );
  }

  private async isAuthenticatedForStore(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    return (await this.memberRepository.isMemberOfStore(projectId, userId));
  }
}
