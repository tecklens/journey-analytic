import { Repository, EntityRepository } from 'nestjs-cassandra';
import { EventEntity } from './event.entity';
import { Observable } from 'rxjs';

@EntityRepository(EventEntity)
export class EventRepository extends Repository<EventEntity> {
    findById(id: any): Observable<EventEntity> {
        return this.findOne({ channel_id: id });
    }
}