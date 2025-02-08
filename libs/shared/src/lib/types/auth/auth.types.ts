import {UserPlan} from "../../types/index.js";

export interface IJwtPayload {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: string;
  projectId: string;
  websiteId?: string;
  roles: string[];
  exp: number;
  plan: UserPlan;
}

export enum ApiAuthSchemeEnum {
  BEARER = 'Bearer',
  API_KEY = 'JaKey',
}

export enum PassportStrategyEnum {
  JWT = 'jwt',
  HEADER_API_KEY = 'apikey',
  GITHUB = 'github',
  GOOGLE = 'google',
  LOCAL = 'local',
}
