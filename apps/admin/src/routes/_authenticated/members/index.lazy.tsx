import { createLazyFileRoute } from '@tanstack/react-router'
import Members from "@admin/features/members";

export const Route = createLazyFileRoute('/_authenticated/members/')({
  component: Members,
})
