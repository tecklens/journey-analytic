import {ConflictException, ForbiddenException, Inject, Injectable} from "@nestjs/common";
import {
  ApiKeyRepository,
  MemberEntity,
  MemberRepository,
  ProjectRepository, ProjectSettingRepository,
  SessionRepository,
  WebsiteRepository
} from "../../repositories/maria";
import {ClientConfigDto, CreateProjectDto, GetWebsiteConfigDto, SearchMembersDto, UpdateProjectConfigDto} from './dtos'
import {IApiKey, IJwtPayload, MemberStatus, ROLES} from "@journey-analytic/shared";
import {ApiException, decryptApiKey, encryptApiKey, PaginatedResponseDto} from "../../types";
import {Transactional} from 'typeorm-transactional';
import {createHash} from "crypto";
import hat from "hat";
import {CLIENT_CONFIG_CACHE_KEY, CLIENT_CONFIG_CACHE_TTL, ENCRYPTION_KEY} from "../../consts";
import {UAParser} from "ua-parser-js";
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectSettingRepository: ProjectSettingRepository,
    private readonly memberRepository: MemberRepository,
    private readonly apiKeyRepository: ApiKeyRepository,
    private readonly websiteRepository: WebsiteRepository,
    private readonly sessionRepository: SessionRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }

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
  async createProject(u: IJwtPayload, payload: CreateProjectDto) {
    if (await this.projectRepository.existsBy({name: payload.name.trim()})) {
      throw new ConflictException('Project name existed');
    }
    const newProject = await this.projectRepository.save({
      name: payload.name.trim(),
      website: payload.website,
      tags: payload.tags,
      createdBy: u.id,
    })

    // tạo api key cho từng project
    const key = await this.generateUniqueApiKey();
    const encryptKey = ENCRYPTION_KEY()
    const encryptedApiKey = encryptApiKey(key, encryptKey);
    const hashedApiKey = createHash('sha256').update(key).digest('hex');

    await this.apiKeyRepository.save({
      projectId: newProject.id,
      hash: hashedApiKey,
      key: encryptedApiKey,
      userId: u.id,
    })

    await this.addMember({
      projectId: newProject.id,
      userId: u.id,
      isDefault: true,
      roles: [ROLES.superuser],
    });

    return newProject;
  }

  private async generateUniqueApiKey() {
    let apiKey = '';
    apiKey = this.generateHatApiKey();
    return apiKey as string;
  }

  /**
   * Extracting the generation functionality so it can be stubbed for functional testing
   *
   * @requires hat
   * @todo Dependency is no longer accessible to source code due of removal from GitHub. Consider look for an alternative.
   */
  private generateHatApiKey(): string {
    return hat();
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

  async getApiKey(user: IJwtPayload): Promise<IApiKey[]> {
    const keys = await this.apiKeyRepository.getApiKeys(
      user.projectId,
    );
    const encryptKey = ENCRYPTION_KEY()
    return keys.map((apiKey: IApiKey) => {
      return {
        key: decryptApiKey(apiKey.key, encryptKey),
        userId: apiKey.userId,
        projectId: apiKey.projectId,
      };
    });
  }

  async generateApiKey(user: IJwtPayload): Promise<IApiKey> {
    const project = await this.projectRepository.findOneBy({
      id: user.projectId,
    });

    if (!project) {
      throw new ApiException(`Project id: ${user.projectId} not found`);
    }

    const key = await this.generateUniqueApiKey();
    const encryptedApiKey = encryptApiKey(key, ENCRYPTION_KEY());
    const hashedApiKey = createHash('sha256').update(key).digest('hex');

    return this.apiKeyRepository.save({
      projectId: user.projectId,
      key: encryptedApiKey,
      userId: user.id,
      hash: hashedApiKey,
    });
  }

  async getWebsites(u: IJwtPayload) {
    const websites = await this.websiteRepository.findByProjectId(
      u.projectId
    )
    let active = undefined;
    if (websites?.length > 0) {
      if (u.websiteId) {
        active = websites.find(e => e.id === u.websiteId)

        if (!active) active = websites[0]
      } else {
        active = websites[0]
      }
    }

    const reLogin = active?.id === u.websiteId

    return {
      active,
      websites,
      haveData: websites?.length > 0,
      reLogin,
    }
  }


  @Transactional()
  async getConfig(u: IJwtPayload, userAgent: string, visitorId: string, payload: GetWebsiteConfigDto): Promise<ClientConfigDto> {
    const key = `${CLIENT_CONFIG_CACHE_KEY}_${visitorId}`;
    const cacheData = await this.cacheManager.get<ClientConfigDto>(key);

    if (cacheData) return cacheData;

    let website = await this.websiteRepository.findByDomain(
      u.projectId,
      payload.domain
    )
    if (!website) {
      website = await this.websiteRepository.save({
        projectId: u.projectId,
        domain: payload.domain,
        createdBy: u.id,
        title: payload.title,
      })
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const newSession = await this.sessionRepository.save({
      projectId: u.projectId,
      websiteId: website.id,
      host: payload.domain,
      browser: result.browser.name,
      os: result.os.name,
      device: result.device.vendor,
      deviceType: result.device.type,
      screen: payload.screen,
      cpu: result.cpu.architecture,
    })

    const res: ClientConfigDto = {
      session: newSession.id,
      enableReplay: await this.projectSettingRepository.existByProjectIdAndCustomer(u.projectId, payload.userId)
    }

    await this.cacheManager.set<ClientConfigDto>(key, res, CLIENT_CONFIG_CACHE_TTL);

    return res;
  }

  async updateProjectSetting(u: IJwtPayload, payload: UpdateProjectConfigDto) {
    return this.projectSettingRepository.save({
      projectId: u.projectId,
      users: payload.users ?? [],
      status: payload.status,
      createdBy: u.id,
      updatedBy: u.id,
    })
  }

  async getProjectSetting(u: IJwtPayload, projectId: string) {
    if (u.projectId != projectId) return null;
    return this.projectSettingRepository.findOneBy({
      projectId: projectId,
    })
  }
}
