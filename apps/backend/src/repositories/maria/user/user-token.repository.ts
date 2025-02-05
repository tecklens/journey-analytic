import { DataSource, Repository } from 'typeorm';
import { UserTokenEntity } from './user-token.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserTokenRepository extends Repository<UserTokenEntity> {
  constructor(dataSource: DataSource) {
    super(UserTokenEntity, dataSource.createEntityManager());
  }
}
