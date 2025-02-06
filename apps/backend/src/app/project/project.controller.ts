import {Controller, Get, Post, Body, Query, UseGuards, Put, Param} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {ProjectService} from "./project.service";
import {JwtAuthGuard} from "../auth/strategy";
import {UserSession} from "../../types";
import {IJwtPayload} from "@journey-analytic/shared";
import {CreateProjectDto, SearchMembersDto} from "./dtos";

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

  @Post('')
  createNewStore(
    @UserSession() user: IJwtPayload,
    @Body() payload: CreateProjectDto,
  ) {
    return this.projectService.createStore(user, payload);
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
}
