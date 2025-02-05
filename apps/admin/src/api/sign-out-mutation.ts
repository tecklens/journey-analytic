import {useMutation, useQueryClient} from '@tanstack/react-query'

import {ACCESS_TOKEN} from '@admin/lib/constants'
import api from "@admin/api/base-api.ts";

export function useSignOutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['sign-out'],
    mutationFn: async () => {
      return await api
        .post('sign-out')
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth'], null)
      sessionStorage.removeItem(ACCESS_TOKEN)
    },
  })
}