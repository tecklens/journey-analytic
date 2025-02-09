import {UserActivityEntity, UserEntity, UserLogEntity, UserTokenEntity} from "./user";
import {ProjectEntity} from "./project";
import {SessionEntity, SessionReplaySettingEntity} from "./session";
import {WebsiteEntity} from "./website";
import {MemberEntity} from "./member";
import {ApiKeyEntity} from "./api-key";
import {BloomFilterVisitorEntity} from "./bloom-filter-visitor";

export const entities = [
    UserEntity,
    UserTokenEntity,
    UserLogEntity,
    UserActivityEntity,
    ApiKeyEntity,
    ProjectEntity,
    SessionEntity,
    SessionReplaySettingEntity,
    WebsiteEntity,
    MemberEntity,
    BloomFilterVisitorEntity,
]