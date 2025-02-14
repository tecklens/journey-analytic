import {UserActivityEntity, UserEntity, UserLogEntity, UserTokenEntity} from "./user";
import {ProjectEntity, ProjectSettingEntity} from "./project";
import {SessionEntity, SessionReplaySettingEntity} from "./session";
import {WebsiteEntity} from "./website";
import {MemberEntity} from "./member";
import {ApiKeyEntity} from "./api-key";
import {BloomFilterVisitorEntity} from "./bloom-filter-visitor";
import {HourlyStatsEntity} from "./hourly-stats";

export const entities = [
  UserEntity,
  UserTokenEntity,
  UserLogEntity,
  UserActivityEntity,
  ApiKeyEntity,
  ProjectEntity,
  ProjectSettingEntity,
  SessionEntity,
  SessionReplaySettingEntity,
  WebsiteEntity,
  MemberEntity,
  BloomFilterVisitorEntity,
  HourlyStatsEntity,
]