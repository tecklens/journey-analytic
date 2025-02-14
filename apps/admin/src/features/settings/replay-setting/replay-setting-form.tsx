import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Button} from '@admin/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@admin/components/ui/form'
import {Tag, TagInput} from "emblor";
import {useEffect, useState} from "react";
import {Switch} from "@admin/components/ui/switch.tsx";
import {useUpdateProjectSettingMutation} from "@admin/api/project/update-project-setting.mutation.ts";
import {useProjectSettingQuery} from "@admin/api/project/project-setting-query.ts";

const displayFormSchema = z.object({
  users: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  status: z.coerce.number()
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  users: [],
  status: 0
}

export function ReplaySettingForm() {
  const updateProject = useUpdateProjectSettingMutation();
  const project = useProjectSettingQuery()
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  })
  const [tags, setTags] = useState<Tag[]>([]);

  async function onSubmit(data: DisplayFormValues) {
    await updateProject.mutateAsync({
      status: data.status,
      users: data.users?.map(e => e.text)
    })
  }

  useEffect(() => {
    if (project.data) {
      form.reset(project.data)
    }
  }, [project.status])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name="status"
          render={({field}) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-left">Enable/ disable record session</FormLabel>
              <FormDescription>
                Note: when recording user sessions, your website will load additional libraries to record sessions and
                increase network bandwidth.
              </FormDescription>
              <Switch checked={field.value === 1} onCheckedChange={field.onChange}/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="users"
          render={({field}) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel className="text-left">Users</FormLabel>
              <FormDescription>
                List of user ids for which the system can record session replays.
              </FormDescription>
              <FormControl>
                <TagInput
                  {...field}
                  activeTagIndex={1}
                  setActiveTagIndex={() => {
                  }}
                  placeholder="Enter a topic"
                  tags={tags}
                  className="sm:min-w-[450px]"
                  setTags={(newTags) => {
                    setTags(newTags);
                    form.setValue('users', newTags as [Tag, ...Tag[]]);
                  }}
                />
              </FormControl>
              <FormDescription>These are the topics that you&apos;re interested in.</FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button disabled={updateProject.isPending || project.isPending} type='submit'>Update</Button>
      </form>
    </Form>
  )
}
