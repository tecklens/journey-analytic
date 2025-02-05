import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserLogEntity } from './user-log.entity';

@Injectable()
export class UserLogRepository extends Repository<UserLogEntity> {
  constructor(dataSource: DataSource) {
    super(UserLogEntity, dataSource.createEntityManager());
  }
}
