import {
  DataSource,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { format, startOfDay } from 'date-fns';
import { find } from 'lodash';
import {IUserResetTokenCount, UserId} from "@journey-analysis/stateless";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      where: {
        email: email,
      },
    });
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.findOne({
      where: {
        id: id,
      },
    });
  }

  getByEmail(email: string): Promise<UserEntity | null> {
    return this.findOneBy({
      email,
    });
  }

  async updatePasswordResetToken(
    userId: string,
    token: string,
    resetTokenCount: IUserResetTokenCount,
  ) {
    return await this.update(
      {
        id: userId,
      },
      {
        resetToken: this.hashResetToken(token),
        resetTokenDate: new Date().toISOString(),
        resetTokenCount,
      },
    );
  }

  async findUserByToken(token: string) {
    return await this.findOne({
      where: {
        resetToken: this.hashResetToken(token),
      },
    });
  }

  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async updateCurrentStore(userId: UserId, storeId: string) {
    return this.update(
      {
        id: userId,
      },
      {
        currentStoreId: storeId,
      },
    );
  }

  async adminStatistic(
    { period, limit }: { period: string; limit: number },
    extendWhere?: string,
  ) {
    const formatDateByPeriod =
      period == 'hour' ? '%Y-%m-%d %H' : period == 'day' ? '%Y-%m-%d' : '%Y-%m';
    const oneWeekAgo = new Date();
    oneWeekAgo.setMinutes(0);
    oneWeekAgo.setSeconds(0);

    const dates: string[] = [];
    const date = new Date();

    if (period == 'hour') {
      oneWeekAgo.setHours(oneWeekAgo.getHours() - limit);

      for (let i = 0; i < limit; i++) {
        dates.push(format(date, 'yyyy-MM-dd HH'));
        date.setHours(date.getHours() - 1);
      }
    } else if (period == 'day') {
      oneWeekAgo.setDate(oneWeekAgo.getDate() - limit);
      oneWeekAgo.setHours(0);

      for (let i = 0; i < limit; i++) {
        dates.push(format(date, 'yyyy-MM-dd'));
        date.setDate(date.getDate() - 1);
      }
    } else {
      oneWeekAgo.setMonth(oneWeekAgo.getMonth() - limit);
      oneWeekAgo.setDate(0);
      oneWeekAgo.setHours(0);
      for (let i = 0; i < limit; i++) {
        dates.push(format(date, 'yyyy-MM-dd'));
        date.setMonth(date.getMonth() - 1);
      }
    }

    const totalPerPeriod = await this.createQueryBuilder()
      .select([
        `date_format(created_at, '${formatDateByPeriod}') as label`,
        'count(id) as cnt',
      ])
      .where(extendWhere ?? '')
      .groupBy(`date_format(created_at, '${formatDateByPeriod}')`)
      .getRawMany();

    const rlt = [];
    for (let i = dates.length - 1; i >= 0; i--) {
      rlt.push({
        cnt: parseInt(
          find(totalPerPeriod, (e) => e.label == dates[i])?.cnt ?? '0',
        ),
        label: dates[i],
      });
    }

    return rlt;
  }

  async adminCountAllInDay(query?: any) {
    const fromDate = startOfDay(new Date());
    const conditions: FindOptionsWhere<UserEntity> = {
      createdAt: MoreThanOrEqual(fromDate),
      ...(query ?? {}),
    };

    return await this.count({
      where: conditions,
    });
  }

  async getListUserByIds(ids: string[]) {
    return this.findBy({
      id: In(ids),
    });
  }
}
