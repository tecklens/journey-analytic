import {DataSource, Repository,} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {HourlyStatsEntity} from "./hourly-stats.entity";
import {calculateJobId} from "@journey-analytic/shared";
import {EPOCH_TIME} from "../../../consts";

@Injectable()
export class HourlyStatsRepository extends Repository<HourlyStatsEntity> {
  constructor(dataSource: DataSource) {
    super(HourlyStatsEntity, dataSource.createEntityManager());
  }

  sumByTimeRange({
                   websiteId,
                   start,
                   end,
                 }: {
    websiteId: string,
    start?: Date,
    end?: Date,
  }) {
    let query = 'p.website_id = :websiteId';
    const params: any = {
      websiteId
    }
    if (start) {
      query = `${query} and p.quarter_point >= :start`
      params.start = calculateJobId(start.getTime(), EPOCH_TIME)
    }

    if (end) {
      query = `${query} and p.quarter_point <= :end`
      params.end = calculateJobId(end.getTime(), EPOCH_TIME)
    }
    return this.createQueryBuilder('p')
      .select(['sum(p.page_views) as pageViews', 'sum(p.visitors) as visitors', 'sum(p.visits) as visits'])
      .where(query, params)
      .getOne()
  }
}
