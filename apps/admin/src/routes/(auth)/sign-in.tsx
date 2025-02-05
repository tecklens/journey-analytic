import {createFileRoute, redirect} from '@tanstack/react-router'
import SignIn from '@admin/features/auth/sign-in'
import {z} from "zod";

export const Route = createFileRoute('/(auth)/sign-in')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.status === 'AUTHENTICATED') {
      throw redirect({
        to: search.redirect || '/',
      })
    }
  },
  component: SignIn,
})
