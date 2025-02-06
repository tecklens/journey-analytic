import {ConflictException, ForbiddenException, Injectable} from "@nestjs/common";
import {ProjectRepository, MemberRepository, MemberEntity, UserRepository} from "../../repositories/maria";
import {CreateProjectDto, SearchMembersDto} from './dtos'
import {IJwtPayload, MemberStatus, ROLES} from "@journey-analytic/shared";
import {ApiException, PaginatedResponseDto} from "../../types";
import {Transactional} from 'typeorm-transactional';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly memberRepository: MemberRepository,
  ) {}
  async getMembers(
    u: IJwtPayload,
    payload: SearchMembersDto,
  ): Promise<PaginatedResponseDto<MemberEntity>> {
    const rlt = await this.memberRepository.findAllMemberInProject(u.projectId);

    return {
      data: rlt[0],
      total: rlt[1],
      page: payload.page,
      pageSize: payload.limit,
    };
  }

  @Transactional()
  async createStore(u: IJwtPayload, payload: CreateProjectDto) {
    if (await this.projectRepository.existsBy({name: payload.name.trim()})) {
      throw new ConflictException('Project name existed');
    }
    const newProject = await this.projectRepository.save({
      name: payload.name.trim(),
      website: payload.website,
      tags: payload.tags,
      createdBy: u.id,
    })

    await this.addMember({
      projectId: newProject.id,
      userId: u.id,
      isDefault: true,
      roles: [ROLES.superuser],
    });

    return newProject;
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

  @Transactional()
  async lockMember(u: IJwtPayload, id: string) {
    const member = await this.memberRepository.findOneBy({
      id: id,
      projectId: u.projectId,
      status: MemberStatus.ACTIVE,
    });

    if (!u.roles.includes('superuser') || !member)
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');

    if (
      member.roles.includes('superuser')
    ) {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    }

    member.status = MemberStatus.INACTIVE;

    return this.memberRepository.save(member);
  }

  @Transactional()
  async unlockMember(u: IJwtPayload, id: string) {
    const member = await this.memberRepository.findOneBy({
      id: id,
      projectId: u.projectId,
      status: MemberStatus.INACTIVE,
    });

    if (!u.roles.includes('superuser') || !member)
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');

    if (
      member.roles.includes('superuser')
    ) {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    }

    member.status = MemberStatus.ACTIVE;

    return this.memberRepository.save(member);
  }
}
