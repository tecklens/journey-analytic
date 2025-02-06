import {DataSource, Repository,} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {SessionReplaySettingEntity} from "./session-replay-setting.entity";

@Injectable()
export class SessionReplaySettingRepository extends Repository<SessionReplaySettingEntity> {
  constructor(dataSource: DataSource) {
    super(SessionReplaySettingEntity, dataSource.createEntityManager());
  }
}
