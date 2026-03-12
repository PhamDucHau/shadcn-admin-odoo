import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Employees } from '@/features/employees'

const employeesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/employees/')({
  validateSearch: employeesSearchSchema,
  component: Employees,
})
