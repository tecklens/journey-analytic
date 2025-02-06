import { queryOptions, useQuery } from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";

import {IProject} from "@journey-analytic/shared";

export function projectQueryOptions() {
  return queryOptions({
    queryKey: ['projects'],
    queryFn: () => {
      return api.get<{active: IProject, projects: IProject[]}>('/user/project').then((res) => res.data)
    },
  })
}

export function useProjectQuery() {
  return useQuery(projectQueryOptions())
}