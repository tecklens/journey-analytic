import { createLazyFileRoute } from '@tanstack/react-router'
import ComingSoon from '@admin/components/coming-soon'

export const Route = createLazyFileRoute('/_authenticated/help-center/')({
  component: ComingSoon,
})
