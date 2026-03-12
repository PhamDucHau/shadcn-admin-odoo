import { z } from 'zod'

export const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  manager_id: z
    .union([z.tuple([z.number(), z.string()]), z.number()])
    .optional()
    .nullable(),
})

export type Department = z.infer<typeof departmentSchema>

export const departmentDetailSchema = departmentSchema.extend({
  manager_id: z
    .union([z.tuple([z.number(), z.string()]), z.number()])
    .optional()
    .nullable(),
})

export type DepartmentDetail = z.infer<typeof departmentDetailSchema>

export const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  manager_id: z.undefined().or(z.number()),
})

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>

export const updateDepartmentSchema = createDepartmentSchema.partial()

export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>
