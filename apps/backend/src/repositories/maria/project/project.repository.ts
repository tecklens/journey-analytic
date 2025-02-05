import {DataSource, Repository,} from 'typeorm';
import {ProjectEntity} from './project.entity';
import {Injectable} from '@nestjs/common';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
  constructor(dataSource: DataSource) {
    super(ProjectEntity, dataSource.createEntityManager());
  }
}
