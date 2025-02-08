import {DataSource, Repository,} from 'typeorm';
import {WebsiteEntity} from './website.entity';
import {Injectable} from '@nestjs/common';

@Injectable()
export class WebsiteRepository extends Repository<WebsiteEntity> {
  constructor(dataSource: DataSource) {
    super(WebsiteEntity, dataSource.createEntityManager());
  }

  async findByProjectId(projectId: string) {
    return this.findBy({
      projectId: projectId,
    })
  }

  async findByDomain(projectId: string, domain: string): Promise<WebsiteEntity | null> {
    return this.findOneBy({
      projectId,
      domain,
    })
  }
}
