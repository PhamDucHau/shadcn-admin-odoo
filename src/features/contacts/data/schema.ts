import { z } from 'zod'

export const contactSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
})

export type Contact = z.infer<typeof contactSchema>

export const contactDetailSchema = contactSchema.extend({
  country_id: z
    .union([z.tuple([z.number(), z.string()]), z.number()])
    .optional()
    .nullable(),
})

export type ContactDetail = z.infer<typeof contactDetailSchema>

export const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  country_id: z.undefined().or(z.number()),
})

export type CreateContactInput = z.infer<typeof createContactSchema>

export const updateContactSchema = createContactSchema.partial()

export type UpdateContactInput = z.infer<typeof updateContactSchema>
