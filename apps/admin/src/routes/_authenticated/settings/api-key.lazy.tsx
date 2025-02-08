import {createLazyFileRoute} from '@tanstack/react-router'
import AccessKeys from "@admin/features/settings/access-keys";

export const Route = createLazyFileRoute('/_authenticated/settings/api-key')({
  component: AccessKeys,
})
