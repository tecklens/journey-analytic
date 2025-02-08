import {IUser, IProject} from "../../entities";

export interface ISuccessResponseDto {
  success: boolean;
}

export interface IServerResponse<T> {
  data: T;
}

export interface IPaginatedResponseDto<T> {
  total: number;

  page: number;

  pageSize: number;

  data: T[];
}

export interface IApiKeyValid {
  project: IProject;
  user: IUser;
  error?: string;
}
