import {Injectable} from '@nestjs/common';
import {InjectRepository} from "nestjs-cassandra";
import {ChannelEntity, ChannelRepository} from "../../repositories/scylla/channel";
import {Observable} from "rxjs";
import {SnowflakeIdService} from "@street-devs/nest-snowflake-id";

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(ChannelRepository)
        private readonly channelRepository: ChannelRepository,
        private readonly snowflakeIdService: SnowflakeIdService
    ) {
    }

    getById(id: any): Observable<ChannelEntity> {
        return this.channelRepository.findById(id);
    }

    findAll() {
        return this.channelRepository.find({})
    }

    createChannel(name: string): Observable<ChannelEntity> {
        const id = (Date.now() << 22) | (1 << 17) | (1 << 12) | 1
        return this.channelRepository.save({
            channel_id: id,
            name: name,
            user_id: 1,
        }, {
            ttl: 1000
        })
    }
}
