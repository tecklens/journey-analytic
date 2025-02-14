import { Injectable } from "@nestjs/common";
import {HourlyStatsRepository, WebsiteRepository} from "../../repositories/maria";
import {IJwtPayload} from "@journey-analytic/shared";
import {StatWebsiteDto} from "./dtos";

@Injectable()
export class WebsiteService {
  constructor(
    private readonly websiteRepository: WebsiteRepository,
    private readonly hourlyStatsRepository: HourlyStatsRepository,
  ) {
  }

  async statsWebsiteById(u: IJwtPayload, websiteId: string, payload: StatWebsiteDto) {
    return this.hourlyStatsRepository.sumByTimeRange({
      websiteId,
      start: payload.start,
      end: payload.end,
    });
  }
}
