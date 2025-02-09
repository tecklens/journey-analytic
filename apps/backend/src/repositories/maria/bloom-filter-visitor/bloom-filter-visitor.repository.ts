import {DataSource, Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {BloomFilterVisitorEntity} from "./bloom-filter-visitor.entity";

@Injectable()
export class BloomFilterVisitorRepository extends Repository<BloomFilterVisitorEntity> {
  constructor(dataSource: DataSource) {
    super(BloomFilterVisitorEntity, dataSource.createEntityManager());
  }
}
