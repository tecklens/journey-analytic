import {useMutation, useQueryClient} from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";
import {toast} from "@admin/hooks/use-toast.ts";
import {ACCESS_TOKEN} from "@admin/lib/constants.ts";

export function useSwitchProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['switch-project'],
    mutationFn: (req: {projectId: string}) => {
      return api
        .post(`/auth/project/${req.projectId}/switch`)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], {user: data.data?.user})
      sessionStorage.setItem(ACCESS_TOKEN, data.data?.token)
      window.location.href = '/'
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Switch project failed',
        description: error?.message
      })
    }
  })
}