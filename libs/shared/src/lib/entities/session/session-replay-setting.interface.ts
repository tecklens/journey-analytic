import {SessionReplaySettingStatus} from "../../consts/index.js";

export interface ISessionReplaySetting {
  projectId: string;
  websiteId: string;
  status: SessionReplaySettingStatus;

  users: any[];

  createdAt: Date;
  updatedAt: Date;
}