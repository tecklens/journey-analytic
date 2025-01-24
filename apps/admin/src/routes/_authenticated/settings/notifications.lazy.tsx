import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsNotifications from '@admin/features/settings/notifications'

export const Route = createLazyFileRoute(
  '/_authenticated/settings/notifications'
)({
  component: SettingsNotifications,
})
