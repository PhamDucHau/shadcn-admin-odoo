import { z } from 'zod'

export const employeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  work_email: z.string().optional().nullable(),
  work_phone: z.string().optional().nullable(),
  // Odoo many2one: [id, name] tuple
  department_id: z
    .union([z.tuple([z.number(), z.string()]), z.number()])
    .optional()
    .nullable(),
})

export type Employee = z.infer<typeof employeeSchema>

export const employeeDetailSchema = employeeSchema.extend({
  department_id: z
    .union([z.tuple([z.number(), z.string()]), z.number()])
    .optional()
    .nullable(),
  job_id: z
    .union([z.tuple([z.number(), z.string()]), z.number()])
    .optional()
    .nullable(),
})

export type EmployeeDetail = z.infer<typeof employeeDetailSchema>

export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  work_email: z.string().email().optional().or(z.literal('')),
  work_phone: z.string().optional(),
  department_id: z.number().optional(),
  job_id: z.number().optional(),
})

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>

export const updateEmployeeSchema = createEmployeeSchema.partial()

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>
