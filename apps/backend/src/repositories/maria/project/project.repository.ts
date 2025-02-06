import {DataSource, In, Repository,} from 'typeorm';
import {ProjectEntity} from './project.entity';
import {Injectable} from '@nestjs/common';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {
  constructor(dataSource: DataSource) {
    super(ProjectEntity, dataSource.createEntityManager());
  }

  async findUserActiveProjects(projectIds: string[]): Promise<ProjectEntity[]> {
    return this.find({
      where: {
        id: In(projectIds),
      },
      relations: ['user'],
    });
  }

  async findByIdWithOwner(id: string) {
    return this.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
  }
}
