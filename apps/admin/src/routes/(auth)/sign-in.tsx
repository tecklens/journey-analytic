import { createFileRoute } from '@tanstack/react-router'
import SignIn from '@admin/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
})
