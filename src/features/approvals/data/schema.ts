import { z } from 'zod'

export const approvalTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  approval_minimum: z.number().int().nonnegative(),
  has_item: z.boolean().optional().default(false),
  has_amount: z.boolean().optional().default(false),
  has_quantity: z.boolean().optional().default(false),
  has_reference: z.boolean().optional().default(false),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
})

export type ApprovalType = z.infer<typeof approvalTypeSchema>

export const createApprovalTypeInputSchema = approvalTypeSchema
  .omit({ id: true, created_at: true, updated_at: true })
  .partial({
    has_item: true,
    has_amount: true,
    has_quantity: true,
    has_reference: true,
  })
  .extend({
    name: z.string().min(1, 'Name is required'),
    approval_minimum: z
      .number({
        required_error: 'Minimum approvers is required',
        invalid_type_error: 'Minimum approvers must be a number',
      })
      .int()
      .nonnegative(),
  })

export type CreateApprovalTypeInput = z.infer<typeof createApprovalTypeInputSchema>

export const updateApprovalTypeInputSchema =
  createApprovalTypeInputSchema.partial()

export type UpdateApprovalTypeInput = z.infer<typeof updateApprovalTypeInputSchema>

export const approvalRequestSchema = z.object({
  id: z.number(),
  category_id: z.number(),
  name: z.string(),
  request_owner_id: z.number(),
  request_date: z.string(),
  amount: z.number().optional().nullable(),
  reference: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  status: z.string().optional().default('pending'),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
})

export type ApprovalRequest = z.infer<typeof approvalRequestSchema>

export const createApprovalRequestInputSchema = approvalRequestSchema
  .omit({ id: true, status: true, created_at: true, updated_at: true })
  .extend({
    name: z.string().min(1, 'Name is required'),
    category_id: z.number({
      required_error: 'Approval type is required',
      invalid_type_error: 'Approval type is required',
    }),
    request_owner_id: z.number({
      required_error: 'Request owner is required',
      invalid_type_error: 'Request owner is required',
    }),
    request_date: z.string().min(1, 'Request date is required'),
  })

export type CreateApprovalRequestInput = z.infer<
  typeof createApprovalRequestInputSchema
>

export const updateApprovalRequestInputSchema =
  createApprovalRequestInputSchema.partial()

export type UpdateApprovalRequestInput = z.infer<
  typeof updateApprovalRequestInputSchema
>

