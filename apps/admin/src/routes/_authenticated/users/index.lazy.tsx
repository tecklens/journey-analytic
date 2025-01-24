import { createLazyFileRoute } from '@tanstack/react-router'
import Users from '@admin/features/users'

export const Route = createLazyFileRoute('/_authenticated/users/')({
  component: Users,
})
