import {Body, Controller, Get, Param, Post, Put, Query, UseGuards} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {ProjectService} from "./project.service";
import {ApiKeyAuthGuard, JwtAuthGuard} from "../auth/strategy";
import {ExternalApiAccessible, UserSession} from "../../types";
import {IApiKey, IJwtPayload} from "@journey-analytic/shared";
import {CreateProjectDto, GetWebsiteConfigDto, SearchMembersDto, UpdateProjectConfigDto} from "./dtos";
import {UserAgent} from "../../types/decorators/user-argnet.decorator";
import {VisitorId} from "../../types/decorators/visitor.decorator";

@Controller("project")
@ApiTags('Project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {
  }

  @Get('members')
  @UseGuards(JwtAuthGuard)
  getMembers(
    @UserSession() user: IJwtPayload,
    @Query() payload: SearchMembersDto,
  ) {
    return this.projectService.getMembers(user, payload);
  }

  @Get('websites')
  @UseGuards(JwtAuthGuard)
  getWebsites(
    @UserSession() user: IJwtPayload,
  ) {
    return this.projectService.getWebsites(user);
  }

  @Post('')
  createNewStore(
    @UserSession() user: IJwtPayload,
    @Body() payload: CreateProjectDto,
  ) {
    return this.projectService.createProject(user, payload);
  }

  @Put('/member/lock/:id')
  @ApiOperation({summary: 'api khóa người dùng', tags: ['admin']})
  lockUser(@UserSession() user: IJwtPayload, @Param('id') id: string) {
    return this.projectService.lockMember(user, id);
  }

  @Put('/member/unlock/:id')
  @ApiOperation({summary: 'api mở khóa người dùng', tags: ['admin']})
  unlockUser(@UserSession() user: IJwtPayload, @Param('id') id: string) {
    return this.projectService.unlockMember(user, id);
  }

  @Post('/api-keys/generate')
  @ApiOperation({
    summary: 'Regenerate api keys',
  })
  @ExternalApiAccessible()
  async generateOrganizationApiKeys(
    @UserSession() user: IJwtPayload,
  ): Promise<IApiKey> {
    return await this.projectService.generateApiKey(user);
  }

  @Get('/api-keys')
  @ApiOperation({
    summary: 'Get api keys',
  })
  @ExternalApiAccessible()
  async getOrganizationApiKeys(
    @UserSession() user: IJwtPayload,
  ): Promise<IApiKey[]> {
    return await this.projectService.getApiKey(user);
  }

  @Put('setting')
  updateProjectSetting(@UserSession() user: IJwtPayload, @Body() payload: UpdateProjectConfigDto) {
    return this.projectService.updateProjectSetting(user, payload)
  }

  @Get('setting')
  getProjectSetting(@UserSession() user: IJwtPayload) {
    return this.projectService.getProjectSetting(user);
  }

  @Get('config')
  @UseGuards(ApiKeyAuthGuard)
  @ExternalApiAccessible()
  getConfigProject(
    @UserSession() user: IJwtPayload,
    @UserAgent() userAgent: string,
    @VisitorId() visitorId: string,
    @Query() payload: GetWebsiteConfigDto
  ) {
    return this.projectService.getConfig(user, userAgent, visitorId, payload);
  }
}
