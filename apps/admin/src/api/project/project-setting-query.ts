import {queryOptions, useQuery} from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";

export function projectSettingQueryOptions() {
  return queryOptions({
    queryKey: ['project-setting'],
    queryFn: () => {
      return api.get('/project/setting').then((res) => res.data)
    },
  })
}

export function useProjectSettingQuery() {
  return useQuery(projectSettingQueryOptions())
}