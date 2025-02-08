import {queryOptions, useQuery} from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";
import {IMember, IUser} from '@journey-analytic/shared'
import {IResponse} from "@admin/types";

export function memberProjectQueryOptions(params: { page: number, limit: number, email?: string }) {
  return queryOptions({
    // initialData: {
    //   data: [],
    //   total: 0,
    //   page: 0,
    //   pageSize: 10
    // },
    queryKey: ['members-projects', params],
    queryFn: () => {
      return api.get<IResponse<IMember & {user: IUser}>>('/project/members', {params})
        .then((res) => res.data)
    }
  })
}

export function useMembersProjectQuery(params: { page: number, limit: number, email?: string }) {
  return useQuery(memberProjectQueryOptions(params))
}