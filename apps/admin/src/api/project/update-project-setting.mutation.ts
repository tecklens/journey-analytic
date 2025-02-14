import {useMutation} from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";
import {toast} from "@admin/hooks/use-toast.ts";

export function useUpdateProjectSettingMutation() {
  return useMutation({
    mutationKey: ['update-project-setting'],
    mutationFn: (req: {status: number, users: string[]}) => {
      return api
        .put(`/project/setting`, req)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Update project setting failed',
        description: error?.message
      })
    }
  })
}