import { createLazyFileRoute } from '@tanstack/react-router'
import SessionReplay from "@admin/features/session-replay";

export const Route = createLazyFileRoute('/_authenticated/sessions/replay')({
  component: SessionReplay,
})
