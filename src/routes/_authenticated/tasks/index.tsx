import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Tasks } from '@/features/tasks'
import { priorities, statuses } from '@/features/tasks/data/data'

const statusValues = statuses.map((s) => s.value) as [string, ...string[]]
const priorityValues = priorities.map((p) => p.value) as [string, ...string[]]

const taskSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z.array(z.enum(statusValues)).optional().catch([]),
  priority: z.array(z.enum(priorityValues)).optional().catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/tasks/')({
  validateSearch: taskSearchSchema,
  component: Tasks,
})
