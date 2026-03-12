import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Departments } from '@/features/departments'

const departmentsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/departments/')({
  validateSearch: departmentsSearchSchema,
  component: Departments,
})
