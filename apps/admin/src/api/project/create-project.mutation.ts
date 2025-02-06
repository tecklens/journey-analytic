import {useMutation} from '@tanstack/react-query'
import api from "@admin/api/base-api.ts";
import {CreateProjectFormSchemaType} from "@admin/lib/schema";
import {toast} from "@admin/hooks/use-toast.ts";

export function useCreateProjectMutation() {
  return useMutation({
    mutationKey: ['create-project'],
    mutationFn: (req: CreateProjectFormSchemaType) => {
      return api
        .post('/project', req)
    },
    onSuccess: () => {},
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Create project failed',
        description: error?.message
      })
    }
  })
}