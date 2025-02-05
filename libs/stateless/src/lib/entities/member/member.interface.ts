import {UserId} from "../../types";
import {MemberStatus} from "../../consts";

export interface IMember {
  id: string;

  userId: UserId;

  projectId: string;

  roles: string[];

  status: MemberStatus;

  createdAt: Date;

  updatedAt: Date;
}