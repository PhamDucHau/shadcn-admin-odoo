import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Approvals } from '@/features/approvals'

const approvalsSearchSchema = z.object({
  tab: z.enum(['types', 'requests']).optional().catch('types'),
})

export const Route = createFileRoute('/_authenticated/approvals/')({
  validateSearch: approvalsSearchSchema,
  component: Approvals,
})

