import { createFileRoute } from '@tanstack/react-router'
import GeneralError from '@admin/features/errors/general-error'

export const Route = createFileRoute('/(auth)/500')({
  component: GeneralError,
})
