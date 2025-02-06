import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsReplay from '@admin/features/settings/replay-setting'

export const Route = createLazyFileRoute('/_authenticated/settings/replay')({
  component: SettingsReplay,
})
