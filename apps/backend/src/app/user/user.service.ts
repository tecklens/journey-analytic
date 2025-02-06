import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AddMemberDto,
  ChangePassDto,
  ChangeProfileDto,
  UpgradePlanDto,
} from './dtos';
import * as bcrypt from 'bcrypt';
import {HttpStatusCode} from 'axios';
import {HttpService} from '@nestjs/axios';
import {v4 as uuidv4} from 'uuid';
import * as process from 'process';
import {Cache, CACHE_MANAGER} from '@nestjs/cache-manager';
import {find} from 'lodash';
import {Transactional} from 'typeorm-transactional';
import {AddNewMemberDto} from '../auth/dtos';
import {UserRepository, UserLogRepository, ProjectRepository, MemberRepository} from "../../repositories/maria";
import {IJwtPayload, UserInfoDto, MemberStatus, UserPlan, UserStatus} from '@journey-analytic/shared';
import {normalizeEmail, buildUserKey, ApiException, makeid} from "../../types";

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userRepository: UserRepository,
    private readonly userLogRepository: UserLogRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly memberRepository: MemberRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }

  async getMe(u: IJwtPayload): Promise<UserInfoDto | null> {
    const user = await this.userRepository.findById(u.id);

    if (user == null) {
      throw new BadRequestException('User not found');
    }

    return UserInfoDto.fromEntity(user, u.roles);
  }

  async updateMe(u: IJwtPayload, payload: ChangeProfileDto) {
    const email = normalizeEmail(payload.email);
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new BadRequestException('Account not exited');

    await this.userRepository.update(
      {
        id: u.id,
      },
      {
        firstName: payload.firstName,
        lastName: payload.lastName,
        bio: payload.bio,
        urls: payload.urls,
        username: payload.username,
      },
    );

    await this.cacheManager.del(
      buildUserKey({
        _id: u.id,
      }),
    );

    const updatedUser = await this.userRepository.findById(u.id);
    if (!updatedUser) throw new NotFoundException('User not found');

    return updatedUser;
  }

  async sendChangePassword(u: IJwtPayload) {
    if (
      !process.env.WOLFX_RESET_PASS_IDENTIFIER ||
      !process.env.WOLFX_API_KEY
    ) {
      throw new BadRequestException('Reset pass feature is not configured');
    }
    const tx_id = uuidv4();
    const user = await this.userRepository.findOne({
      where: {
        id: u.id,
      },
      select: ['id', 'email'],
    });

    if (user) {
      await this.userRepository.update(
        {
          id: user.id,
        },
        {
          changePassTxId: tx_id,
        },
      );

      const response = await this.httpService
        .request({
          method: 'POST',
          url: 'https://flow.wolfx.app/wolf/v1/trigger/',
          data: JSON.stringify({
            workflowId: process.env.WOLFX_RESET_PASS_IDENTIFIER,
            target: {
              subcriberId: `change-password-${tx_id}`,
              phone: '0333xxx',
              email: user.email,
              tx_id: tx_id,
            },
            overrides: {},
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `ApiKey ${process.env.WOLFX_API_KEY}`,
          },
          validateStatus: null,
        })
        .toPromise();

      if (response?.status === HttpStatusCode.Created) {
        console.debug('send change password success');
      } else {
        throw new BadRequestException(
          'There was an error when sending the password reset email.',
        );
      }
    }
  }

  async changePass(u: IJwtPayload, payload: ChangePassDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: u.id,
      },
      select: ['id'],
    });

    if (!user)
      throw new BadRequestException(
        'Invalid request. The Transaction ID is either unsuccessful or has expired.',
      );

    const passwordHash = await bcrypt.hash(payload.password, 10);

    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        password: passwordHash,
        changePassTxId: undefined,
      },
    );
  }

  async getActiveProject(u: IJwtPayload) {
    const members = await this.memberRepository.findUserActiveMembers(u.id);
    const projects = await this.projectRepository.findUserActiveProjects(
      members.map((e) => e.projectId),
    );
    return {
      projects,
      active: find(projects, e => e.id === u.projectId),
    };
  }

  @Transactional()
  async addMember(u: IJwtPayload, payload: AddMemberDto) {
    if (
      payload.roles.includes('admin') ||
      payload.roles.includes('superuser')
    ) {
      throw new ForbiddenException('Bạn không có quyền thêm người dùng này');
    }
    const newMember = await this.userRepository.getByEmail(payload.staffEmail);
    if (!newMember) {
      throw new NotFoundException('Email nhân viên chưa đăng ký tài khoản');
    }
    const [members] = await this.memberRepository.findAllMemberInProject(
      u.projectId,
    );

    if (members.length > 5)
      throw new BadRequestException('Một cửa hàng không vượt quá 5 thành viên');

    if (find(members, (e) => e.user.email === payload.staffEmail)) {
      throw new BadRequestException('Người dùng này đã có trong tổ chức');
    }

    await this.memberRepository.save({
      projectId: u.projectId,
      userId: newMember.id,
      roles: payload.roles,
      status: MemberStatus.ACTIVE,
    });
  }

  @Transactional()
  async addNewUserToStore(u: IJwtPayload, body: AddNewMemberDto) {
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
      ownerOrg: u.projectId,
      referralBy: u.id,
      firstName: body.firstName,
      lastName: body.lastName,
      password: passwordHash,
      plan: UserPlan.free,
      billingCode: makeid(10).toUpperCase(),
      status: UserStatus.ACTIVE,
    });

    return await this.memberRepository.addMember(
      u.projectId,
      {
        userId: user.id,
        roles: body.roles ?? [],
        memberStatus: MemberStatus.ACTIVE,
      },
      true,
    );
  }

  @Transactional()
  async upgradePlan(u: IJwtPayload, payload: UpgradePlanDto) {
    const user = await this.userRepository.findById(payload.userId);

    if (!user) throw new NotFoundException('User not exist');

    await this.userLogRepository.save({
      userId: user.id,
      changed: JSON.stringify(user),
      createdBy: u.id,
    });

    user.plan = payload.plan;
    await this.userRepository.save(user);
  }
}
