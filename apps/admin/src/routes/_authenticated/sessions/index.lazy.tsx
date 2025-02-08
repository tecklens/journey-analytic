import { createLazyFileRoute } from '@tanstack/react-router'
import Sessions from '@admin/features/session'

export const Route = createLazyFileRoute('/_authenticated/sessions/')({
  component: Sessions,
})
