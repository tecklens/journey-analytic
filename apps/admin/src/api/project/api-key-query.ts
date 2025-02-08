import { queryOptions, useQuery } from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";

import {IApiKey} from "@journey-analytic/shared";

export function apiKeyQueryOptions() {
  return queryOptions({
    queryKey: ['api-key-project'],
    queryFn: () => {
      return api.get<IApiKey[]>('/project/api-keys').then((res) => res.data)
    },
  })
}

export function useApiKeyQuery() {
  return useQuery(apiKeyQueryOptions())
}