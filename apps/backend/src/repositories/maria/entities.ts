import {UserActivityEntity, UserEntity, UserLogEntity, UserTokenEntity} from "./user";
import {ProjectEntity} from "./project";
import {SessionEntity, SessionReplaySettingEntity} from "./session";
import {WebsiteEntity} from "./website";
import {MemberEntity} from "./member";

export const entities = [
  UserEntity,
  UserTokenEntity,
  UserLogEntity,
  UserActivityEntity,
  ProjectEntity,
  SessionEntity,
  SessionReplaySettingEntity,
  WebsiteEntity,
  MemberEntity
]