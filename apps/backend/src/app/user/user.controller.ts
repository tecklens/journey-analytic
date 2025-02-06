import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/strategy';
import {AddMemberDto, ChangePassDto, ChangeProfileDto, UpgradePlanDto,} from './dtos';
import {AddNewMemberDto} from '../auth/dtos';
import {UserSession} from '../../types'
import {IJwtPayload,} from '@journey-analytic/shared';
import {UserService} from "./user.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  getMe(@UserSession() user: IJwtPayload) {
    return this.userService.getMe(user);
  }

  @Put('')
  updateMe(
    @UserSession() user: IJwtPayload,
    @Body() payload: ChangeProfileDto,
  ) {
    return this.userService.updateMe(user, payload);
  }

  @Post('/send-email-change-pass')
  async sendEmailChangePass(@UserSession() user: IJwtPayload) {
    return await this.userService.sendChangePassword(user);
  }

  @Post('/change-pass')
  async changePass(
    @UserSession() user: IJwtPayload,
    @Body() payload: ChangePassDto,
  ) {
    return await this.userService.changePass(user, payload);
  }

  @Get('/project')
  async getActiveProject(@UserSession() user: IJwtPayload) {
    return this.userService.getActiveProject(user);
  }

  @Post('add-member')
  @UseGuards(JwtAuthGuard)
  addMember(@UserSession() user: IJwtPayload, @Body() payload: AddMemberDto) {
    return this.userService.addMember(user, payload);
  }

  @Post('add-new-member')
  @UseGuards(JwtAuthGuard)
  addNewMember(
    @UserSession() user: IJwtPayload,
    @Body() payload: AddNewMemberDto,
  ) {
    return this.userService.addNewUserToStore(user, payload);
  }

  @Put('upgrade-plan')
  @UseGuards(JwtAuthGuard)
  upgradePlan(
    @UserSession() user: IJwtPayload,
    @Body() payload: UpgradePlanDto,
  ) {
    return this.userService.upgradePlan(user, payload);
  }
}
