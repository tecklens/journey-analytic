import { queryOptions, useQuery } from '@tanstack/react-query'

export function authQueryOptions() {
  return queryOptions({
    queryKey: ['auth'],
    queryFn: () => ({}),
  })
}

export function useAuthQuery() {
  return useQuery(authQueryOptions())
}