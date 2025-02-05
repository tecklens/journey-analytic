import {DataSource, Repository,} from 'typeorm';
import {SessionEntity} from './session.entity';
import {Injectable} from '@nestjs/common';

@Injectable()
export class SessionRepository extends Repository<SessionEntity> {
  constructor(dataSource: DataSource) {
    super(SessionEntity, dataSource.createEntityManager());
  }
}
