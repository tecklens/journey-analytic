import { queryOptions, useQuery } from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";

export function authQueryOptions() {
  return queryOptions({
    queryKey: ['user'],
    queryFn: () => {
      return api.get('/user/me').then((res) => res.data)
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useAuthQuery() {
  return useQuery(authQueryOptions())
}