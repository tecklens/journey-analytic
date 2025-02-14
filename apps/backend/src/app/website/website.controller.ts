import {Controller, Get, Param, Query, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/strategy";
import {UserSession} from "../../types";
import {IJwtPayload} from "@journey-analytic/shared";
import {ApiTags} from "@nestjs/swagger";
import {WebsiteService} from "./website.service";
import {StatWebsiteDto} from "./dtos";

@Controller("website")
@ApiTags('Website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {
  }

  @Get(':id, stats')
  @UseGuards(JwtAuthGuard)
  getWebsiteStat(
    @UserSession() user: IJwtPayload,
    @Param('id') id: string,
    @Query() payload: StatWebsiteDto
  ) {
    return this.websiteService.statsWebsiteById(user, id, payload);
  }
}
