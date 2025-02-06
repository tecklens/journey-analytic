import {IUser} from '@journey-analytic/shared'
export type ResSignIn = {
  accessToken: string
  user: IUser
}

export type ResSignOut = {
  message: string
}

export type ResRefresh = {
  accessToken: string
}

export type ResAuth = {
  user: IUser
}

export interface IResponse<T> {
  page: number;
  total: number;
  pageSize: number;
  data: T[];
}