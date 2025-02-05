import { Repository, EntityRepository } from 'nestjs-cassandra';
import { ChannelEntity } from './channel.entity';
import { Observable } from 'rxjs';

@EntityRepository(ChannelEntity)
export class ChannelRepository extends Repository<ChannelEntity> {
    findById(id: any): Observable<ChannelEntity> {
        return this.findOne({ channel_id: id });
    }
}