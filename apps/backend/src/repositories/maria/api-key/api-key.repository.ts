import {DataSource, Repository} from "typeorm";
import {ApiKeyEntity} from "./api-key.entity";
import {IApiKey} from "@journey-analytic/shared";
import {Injectable} from "@nestjs/common";

@Injectable()
export class ApiKeyRepository extends Repository<ApiKeyEntity> {
  constructor(private dataSource: DataSource) {
    super(ApiKeyEntity, dataSource.createEntityManager());
  }

  async getApiKeys(projectId: string): Promise<IApiKey[]> {
    return await this.findBy(
      {
        projectId: projectId,
      },
    );
  }

  async findByApiKey({hash}: {hash: string}): Promise<ApiKeyEntity | null> {
    return await this.findOne({
      where: {
        hash: hash,
      },
      relations: ['project', 'user']
    })
  }
}
