import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import {CassandraModule} from "nestjs-cassandra";
import {ChannelEntity, ChannelRepository} from "../../repositories/channel";

@Module({
  imports: [CassandraModule.forFeature([ChannelEntity, ChannelRepository])],
  providers: [ChannelService],
  controllers: [ChannelController]
})
export class ChannelModule {}
