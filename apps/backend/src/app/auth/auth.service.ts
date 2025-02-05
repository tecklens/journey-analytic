import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiException,
  AuthProviderEnum,
  buildUserKey,
  IUserResetTokenCount,
  makeid,
  normalizeEmail,
  UserId,
  UserPlan,
} from '@reakestate/stateless';
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isBefore,
  parseISO,
  subDays,
} from 'date-fns';
import {
  IUserDpm,
  UserActivityRepository,
  UserRepository,
} from '@repository/user';
import { JwtService } from '@nestjs/jwt';
import {
  CreateStoreDto,
  LoginBodyDto,
  PasswordResetBodyDto,
  UserRegistrationBodyDto,
} from '@app/auth/dtos';
import * as bcrypt from 'bcrypt';
import { Cache, CACHE_MANAGER, CacheKey } from '@nestjs/cache-manager';
import * as process from 'process';
import { StoreEntity, StoreRepository } from '@repository/store';
import { MemberEntity, MemberRepository } from '@repository/member';
import { MemberStatusEnum } from '@repository/member/member.status';
import { IJwtPayload } from '@t/jwt-payload';
import { UserStatus } from '@t/user.status';
import { RoleRepository } from '@repository/role';
import { DEFAULT_ROLES, ROLES } from '@app/consts/default-role';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';
import { IFingerprint } from 'nestjs-fingerprint';
import { ActivityType } from '@app/consts/user.activity';
import { defaultNumDayDeleteVideo, refreshSecret } from '@config/env';
import {
  NumDayVideoPerUser,
  StoragePerUser,
} from '@app/consts/limit-video-per-user';
import { createHash } from 'crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MailPayload } from '@t/mail-payload';

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
    private readonly storeRepository: StoreRepository,
    private readonly memberRepository: MemberRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userActivityRepository: UserActivityRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('send-email') private emailQueue: Queue<MailPayload, any, any>,
  ) {}

  public async validateUser(payload: IJwtPayload): Promise<IUserDpm> {
    // We run these in parallel to speed up the query time
    const user = await this.getUser({ id: payload.id });

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
    const { name, emails, photos } = profile;
    const email = normalizeEmail(emails[0].value);
    let user: IUserDpm = await this.userRepository.findByEmail(email);
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

      await this.createStore({
        userId: user.id,
        name: email,
        field: '',
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
    user: IUserDpm;
    fp?: IFingerprint;
    type?: ActivityType;
  }): Promise<{ token: string; refreshToken: string }> {
    const members = await this.memberRepository.findUserActiveMembers(user.id);
    const stores = await this.storeRepository.findUserActiveStores(
      members.map((e) => e.storeId),
    );

    if (!stores || stores.length === 0) {
      throw new ConflictException('Bạn đang không thuộc cửa hàng nào');
    }

    let store: StoreEntity | undefined = undefined;
    if (user.currentStoreId) {
      store = stores.find((e) => e.id === user.currentStoreId);
    }

    if (!store) store = stores[0];

    const member = members.find((e) => e.storeId === store.id);

    try {
      await this.userActivityRepository.save({
        userId: user.id,
        storeId: store.id,
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
      store.id,
      store.owner,
      store.user.numDayDeleteVideo,
      member,
      store.user.limitStorage,
    );
  }

  public async getSignedToken(
    user: IUserDpm | IJwtPayload,
    storeId: string,
    ownerStore: string,
    numDayDeleteVideo: number,
    member: MemberEntity,
    limitStorage: number,
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
          numDayDeleteVideo: numDayDeleteVideo,
          storeId: storeId,
          ownerStore,
          roles,
          ls: limitStorage ?? StoragePerUser[UserPlan.free],
          ownerOrg: user.ownerOrg,
          referralBy: user.referralBy,
        },
        {
          expiresIn: expiresIn,
          issuer: 'real_estate_api',
        },
      ),
      expiresIn,
      refreshToken: await this.generateRefreshToken(
        user,
        storeId,
        ownerStore,
        roles,
        limitStorage,
      ),
    };
  }

  async generateRefreshToken(
    user: IUserDpm | IJwtPayload,
    storeId: string,
    ownerStore,
    roles: string[],
    limitStorage: number,
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
        numDayDeleteVideo: user.numDayDeleteVideo ?? defaultNumDayDeleteVideo,
        storeId: storeId,
        ownerStore,
        roles,
        ls: limitStorage ?? StoragePerUser[UserPlan.free],
        ownerOrg: user.ownerOrg,
        referralBy: user.referralBy,
      },
      { expiresIn: expiresIn, issuer: 'dhn_api', secret: refreshSecret },
    );

    await this.cacheManager.set(
      `refresh_token_${user.id}_${storeId}`,
      newRefreshToken,
      expiresIn, // 2d
    );

    return newRefreshToken;
  }

  async generateTokenPair(user: IJwtPayload) {
    const expiresIn = 14400; // 2 hours

    let ownerStore = user.ownerStore;
    if (ownerStore) {
      const store = await this.storeRepository.findById(user.storeId);
      ownerStore = store.owner;
    }

    return {
      token: this.jwtService.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          plan: user.plan,
          numDayDeleteVideo: user.numDayDeleteVideo ?? defaultNumDayDeleteVideo,
          storeId: user.storeId,
          ownerStore: ownerStore,
          roles: user.roles,
          ls: user.ls,
          ownerOrg: user.ownerOrg,
          referralBy: user.referralBy,
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
    if (!u.roles?.includes('superuser') && !u.roles?.includes('admin')) {
      throw new ForbiddenException();
    }
    if (process.env.DISABLE_USER_REGISTRATION === 'true')
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
      numDayDeleteVideo: NumDayVideoPerUser[UserPlan.free],
      ownerOrg: u?.storeId,
      referralBy: u?.id,
    });

    const { store } = await this.createStore({
      userId: user.id,
      name: body.storeName,
      field: body.field,
      ownerOrg: u?.storeId,
      referralBy: u?.id,
    });

    try {
      await this.userActivityRepository.save({
        userId: user.id,
        storeId: store.id,
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

  @Transactional()
  async createUserAdmin(
    u: IJwtPayload,
    body: UserRegistrationBodyDto,
    fp: IFingerprint,
  ) {
    if (
      '67a19aefa243ef3535cc75ab089bdcf7a77614d2ae0a98dcfbb03fd90ad13834' !==
      createHash('sha256').update(body.key).digest('hex')
    ) {
      throw new ConflictException('Api Key incorrect');
    }

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
      numDayDeleteVideo: NumDayVideoPerUser[UserPlan.free],
      ownerOrg: u?.storeId,
      referralBy: u?.id,
    });

    const { store } = await this.createStore(
      {
        userId: user.id,
        name: body.storeName,
        field: body.field,
      },
      [...(body.roles ?? [])],
    );

    try {
      await this.userActivityRepository.save({
        userId: user.id,
        storeId: store.id,
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

  async updateStoreAfterRegister(u: IJwtPayload, payload: CreateStoreDto) {
    const user = await this.userRepository.findById(u.id);

    if (!user)
      throw new NotFoundException('Khong ton tai thong tin nguoi dung');

    payload.userId = user.id;

    await this.createStore(payload);
  }

  private async createStore(body: CreateStoreDto, roles?: string[]) {
    const defaultRoles = [...(roles ?? []), ROLES.owner];
    const store = await this.storeRepository.save({
      owner: body.userId,
      name: body.name,
      field: body.field,
      plan: UserPlan.free,
      ownerOrg: body.ownerOrg,
      referralBy: body.referralBy,
    });

    const member = await this.addMember({
      storeId: store.id,
      userId: body.userId,
      isDefault: true,
      roles: defaultRoles,
    });

    await this.makeDefaultRoleStore(store);

    return {
      store,
      member,
    };
  }

  private async makeDefaultRoleStore(store: StoreEntity) {
    const roles: any[] = DEFAULT_ROLES.map((e) => {
      const roleId = uuidv4();
      return {
        id: roleId,
        storeId: store.id,
        name: e.name,
        label: e.label,
        permissions: e.permissions?.map((f) => ({
          roleId: roleId,
          action: f.action,
          subject: f.subject,
          label: f.label,
        })),
      };
    });

    await this.roleRepository.save(roles);
  }

  private async addMember({
    storeId,
    userId,
    roles,
    isDefault,
  }: {
    storeId: string;
    userId: string;
    roles: string[];
    isDefault: boolean;
  }) {
    const isAlreadyMember = await this.isMember(userId, storeId);
    if (isAlreadyMember) throw new ApiException('Member already exists');

    return await this.memberRepository.addMember(
      storeId,
      {
        userId: userId,
        roles: roles,
        memberStatus: MemberStatusEnum.ACTIVE,
      },
      isDefault,
    );
  }

  private async isMember(
    userId: string,
    organizationId: string,
  ): Promise<boolean> {
    return !!(await this.memberRepository.findMemberByUserId(
      organizationId,
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
      const { error, isBlocked } = this.isRequestBlocked(foundUser);
      if (isBlocked) {
        throw new UnauthorizedException(error);
      }
      const otpToken = this.getRandomNumberString();

      await this.cacheManager.del(
        buildUserKey({
          id: foundUser.id,
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
        id: user.id,
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
      ...(await this.generateUserToken({ user, fp })),
    };
  }

  @CacheKey('user:by-id')
  private async getUser({ id }: { id: UserId }) {
    return await this.userRepository.findOneBy({
      id,
      status: UserStatus.ACTIVE,
    });
  }

  private async updateUserUsername(
    user: IUserDpm,
    profile: {
      name: string;
      login: string;
      email: string;
      avatar_url: string;
      id: string;
    },
    authProvider: AuthProviderEnum,
  ): Promise<IUserDpm> {
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

      user = await this.userRepository.findOneBy({
        id: user.id,
      });
      if (!user) throw new ApiException('User not found');
    }

    return user;
  }

  private isRequestBlocked(user: IUserDpm) {
    const lastResetAttempt = user.resetTokenDate;

    if (!lastResetAttempt) {
      return {
        isBlocked: false,
        error: '',
      };
    }
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

  private getUpdatedRequestCount(user: IUserDpm): IUserResetTokenCount {
    const now = new Date().toISOString();
    const lastResetAttempt = user.resetTokenDate ?? now;
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

  private async updateFailedAttempts(user: IUserDpm) {
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

  private isAccountBlocked(user: IUserDpm) {
    const lastFailedAttempt = user?.failedLogin?.lastFailedAttempt;
    if (!lastFailedAttempt) return false;

    const diff = this.getTimeDiffForAttempt(lastFailedAttempt);

    return (
      user?.failedLogin &&
      user?.failedLogin?.times >= this.MAX_LOGIN_ATTEMPTS &&
      diff < this.BLOCKED_PERIOD_IN_MINUTES
    );
  }

  private async resetFailedAttempts(user: IUserDpm) {
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

  private async getUsersMembersStoreIds(
    userId: string,
  ): Promise<MemberEntity[]> {
    return await this.memberRepository.findUserActiveMembers(userId);
  }

  async switchStore({
    newStoreId,
    userId,
  }: {
    newStoreId: string;
    userId: string;
  }) {
    const isAuthenticated = await this.isAuthenticatedForStore(
      userId,
      newStoreId,
    );
    if (!isAuthenticated) {
      throw new UnauthorizedException(
        `Not authorized for organization ${newStoreId}`,
      );
    }

    const store = await this.storeRepository.findByIdWithOwner(newStoreId);
    if (!store) {
      throw new NotFoundException('Store not exist');
    }

    const member = await this.memberRepository.findMemberByUserId(
      newStoreId,
      userId,
    );
    if (!member) throw new ApiException('Member not found');

    const user = await this.userRepository.findById(userId);
    if (!user) throw new ApiException(`User ${userId} not found`);

    await this.userRepository.updateCurrentStore(user.id, newStoreId);

    return await this.getSignedToken(
      user,
      newStoreId,
      store.owner,
      store.user.numDayDeleteVideo,
      member,
      store.user.limitStorage,
    );
  }

  private async isAuthenticatedForStore(
    userId: string,
    storeId: string,
  ): Promise<boolean> {
    return !!(await this.memberRepository.isMemberOfStore(storeId, userId));
  }
}
