import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {toast} from '@admin/hooks/use-toast'
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
import {useState} from "react";
import {Switch} from "@admin/components/ui/switch.tsx";

const displayFormSchema = z.object({
  users: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  status: z.boolean()
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  users: [],
  status: true
}

export function ReplaySettingForm() {
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  })
  const [tags, setTags] = useState<Tag[]>([]);

  function onSubmit(data: DisplayFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

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
                Note: when recording user sessions, your website will load additional libraries to record sessions and increase network bandwidth.
              </FormDescription>
              <Switch checked={field.value} onCheckedChange={field.onChange}/>
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
        <Button type='submit'>Update</Button>
      </form>
    </Form>
  )
}
