import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {EventService} from './event.service';
import {ScyllaModule} from "../scylla/scylla.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {HourlyStatsRepository, WebsiteRepository} from "../../repositories/maria";
import {BullModule} from "@nestjs/bullmq";
import {StatEventConsumer} from "./stat-event.consumer";

const repositories = [
  WebsiteRepository,
  HourlyStatsRepository,
]

@Module({
  imports: [
    ScyllaModule,
    TypeOrmModule.forFeature(repositories),
    BullModule.registerQueue({
      name: 'stat-event'
    })
  ],
  controllers: [EventController],
  providers: [EventService, StatEventConsumer, ...repositories]
})
export class EventModule {
}
