import { createFileRoute } from '@tanstack/react-router'
import { ContactDetail } from '@/features/contacts/contact-detail'

export const Route = createFileRoute('/_authenticated/contacts/$contactId')({
  component: ContactDetail,
})
