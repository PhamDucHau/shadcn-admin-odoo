import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  login: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  active: z.boolean().optional().nullable(),
})

export type User = z.infer<typeof userSchema>

export const userDetailSchema = userSchema
export type UserDetail = z.infer<typeof userDetailSchema>

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  login: z.string().min(1, 'Login is required'),
  email: z.string().optional(),
  phone: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = createUserSchema.partial()
export type UpdateUserInput = z.infer<typeof updateUserSchema>
