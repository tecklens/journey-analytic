import {z} from "zod";

export const CreateProjectFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Please enter your project name' })
    .max(64, { message: 'Maximum length is 64 characters' }),
  website: z
    .string()
    .optional(),
})

export type CreateProjectFormSchemaType = z.infer<typeof CreateProjectFormSchema>