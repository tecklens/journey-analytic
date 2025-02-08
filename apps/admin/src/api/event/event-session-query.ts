import {queryOptions, useQuery} from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";

export function eventSessionQueryOptions() {
  return queryOptions({
    queryKey: ['events-session'],
    queryFn: () => {
      return api.get<any[]>('/event/session/3').then((res) => res.data)
    },
  })
}

export function useEventSessionQuery() {
  return useQuery(eventSessionQueryOptions())
}