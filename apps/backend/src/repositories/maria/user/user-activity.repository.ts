import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserActivityEntity } from './user-activity.entity';

@Injectable()
export class UserActivityRepository extends Repository<UserActivityEntity> {
  constructor(dataSource: DataSource) {
    super(UserActivityEntity, dataSource.createEntityManager());
  }

  async findAllByUserId(
    userId: string,
    skip: number,
    take: number,
  ): Promise<[UserActivityEntity[], number]> {
    return this.findAndCount({
      where: { userId },
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
