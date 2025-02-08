import {queryOptions, useQuery} from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";
import {IWebsite} from "@journey-analytic/shared";

export function websiteQueryOptions({projectId}: { projectId?: string }) {
  return queryOptions({
    queryKey: ['websites', projectId],
    queryFn: () => {
      return api.get<{ active: IWebsite, websites: IWebsite[], haveData: boolean }>('/project/websites').then((res) => res.data)
    },
  })
}

export function useWebsiteQuery({projectId}: { projectId?: string }) {
  return useQuery(websiteQueryOptions({projectId}))
}