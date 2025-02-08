import {Controller, Get, Post, Body, Query, UseGuards, Put, Param} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {ProjectService} from "./project.service";
import {ApiKeyAuthGuard, JwtAuthGuard} from "../auth/strategy";
import {ExternalApiAccessible, UserSession} from "../../types";
import {IJwtPayload, IApiKey} from "@journey-analytic/shared";
import {CreateProjectDto, GetWebsiteConfigDto, SearchMembersDto} from "./dtos";
import {UserAgent} from "../../types/decorators/user-argnet.decorator";

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
  @ApiOperation({ summary: 'api khóa người dùng', tags: ['admin'] })
  lockUser(@UserSession() user: IJwtPayload, @Param('id') id: string) {
    return this.projectService.lockMember(user, id);
  }

  @Put('/member/unlock/:id')
  @ApiOperation({ summary: 'api mở khóa người dùng', tags: ['admin'] })
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

  @Get('config')
  @UseGuards(ApiKeyAuthGuard)
  @ExternalApiAccessible()
  getConfigProject(@UserSession() user: IJwtPayload, @UserAgent() userAgent: string, @Query() payload: GetWebsiteConfigDto) {
    return this.projectService.getConfig(user, userAgent, payload);
  }
}
