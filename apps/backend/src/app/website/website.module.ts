import { Module } from "@nestjs/common";
import { WebsiteService } from "./website.service";
import { WebsiteController } from "./website.controller";
import {HourlyStatsRepository, WebsiteRepository} from "../../repositories/maria";
import {TypeOrmModule} from "@nestjs/typeorm";

const repositories = [
  WebsiteRepository,
  HourlyStatsRepository,
]

@Module({
  imports: [TypeOrmModule.forFeature(repositories)],
  providers: [WebsiteService, ...repositories],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
