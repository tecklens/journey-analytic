import {useMutation, useQueryClient} from '@tanstack/react-query'

import {ACCESS_TOKEN} from '@admin/lib/constants'
import api from "@admin/api/base-api.ts";
import {SignInFormSchemaType} from "@admin/lib/schema";

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['sign-in'],
    mutationFn: (req: SignInFormSchemaType) => {
      return api
        .post('/auth/login', req)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], {user: data.data?.user})
      sessionStorage.setItem(ACCESS_TOKEN, data.data?.token)
      window.location.href = '/'
    },
    onError: () => {
      queryClient.setQueryData(['auth'], {user: null})
      sessionStorage.removeItem(ACCESS_TOKEN)
    }
  })
}