import { createLazyFileRoute } from '@tanstack/react-router'
import Settings from '@admin/features/settings'

export const Route = createLazyFileRoute('/_authenticated/settings')({
  component: Settings,
})
