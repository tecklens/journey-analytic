import { createLazyFileRoute } from '@tanstack/react-router'
import Chats from '@admin/features/chats'

export const Route = createLazyFileRoute('/_authenticated/chats/')({
  component: Chats,
})
