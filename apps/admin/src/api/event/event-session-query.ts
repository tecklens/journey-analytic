import {queryOptions, useQuery} from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";

export function eventSessionQueryOptions() {
  return queryOptions({
    queryKey: ['events-session'],
    queryFn: () => {
      return api.get<any[]>('/event/session/f7a32bc9-3524-495c-82f0-327d1c83d05b').then((res) => res.data)
    },
  })
}

export function useEventSessionQuery() {
  return useQuery(eventSessionQueryOptions())
}