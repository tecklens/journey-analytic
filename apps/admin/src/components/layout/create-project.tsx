import {Dialog, DialogContent, DialogTitle} from "@admin/components/ui/dialog.tsx";
import {useForm} from "react-hook-form";
import {CreateProjectFormSchema, CreateProjectFormSchemaType} from "@admin/lib/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@admin/components/ui/form.tsx";
import {Input} from "@admin/components/ui/input.tsx";
import {Button} from "@admin/components/ui/button.tsx";
import {useCreateProjectMutation} from "@admin/api/project/create-project.mutation.ts";
import {useSwitchProjectMutation} from "@admin/api/project/switch-project.mutation.ts";

export default function CreateProject({open, setOpen}: { open: boolean, setOpen: (v: boolean) => void }) {
  const project = useCreateProjectMutation()
  const switchPproject = useSwitchProjectMutation()
  const form = useForm<CreateProjectFormSchemaType>({
    resolver: zodResolver(CreateProjectFormSchema),
    defaultValues: {
      name: '',
      website: '',
    },
  })

  async function onSubmit(data: CreateProjectFormSchemaType) {
    const r = await project.mutateAsync(data)
    setOpen(false)
    await switchPproject.mutateAsync({projectId: r.data?.id})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Create project</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='name'
                render={({field}) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Project Name <span className={'text-red-500'}>*</span></FormLabel>
                    <FormControl>
                      <Input placeholder='Journey Analytic' {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='website'
                render={({field}) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder='ja.wolfx.app' {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <Button disabled={project.isPending} type={'submit'}>Create</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}