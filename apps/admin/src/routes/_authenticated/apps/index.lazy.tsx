import { createLazyFileRoute } from '@tanstack/react-router'
import Apps from '@admin/features/apps'

export const Route = createLazyFileRoute('/_authenticated/apps/')({
  component: Apps,
})
