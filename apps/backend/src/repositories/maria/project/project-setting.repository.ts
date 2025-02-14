import {DataSource, ILike, Repository,} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {ProjectSettingEntity} from "./project-setting.entity";

@Injectable()
export class ProjectSettingRepository extends Repository<ProjectSettingEntity> {
  constructor(dataSource: DataSource) {
    super(ProjectSettingEntity, dataSource.createEntityManager());
  }

  async existByProjectIdAndCustomer(projectId: string, userId?: string) {
    if (!userId) return false;
    return this.existsBy({
      projectId,
      users: ILike(`%${userId}%`)
    })
  }
}
