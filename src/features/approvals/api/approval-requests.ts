import { api } from '@/lib/api'
import type {
  ApprovalRequest,
  CreateApprovalRequestInput,
  UpdateApprovalRequestInput,
} from '../data/schema'

export interface ApprovalRequestsResponse {
  data: ApprovalRequest[]
  count: number
  user?: string
}

export interface ApprovalRequestDetailResponse {
  data: ApprovalRequest
  user?: string
}

export interface CreateApprovalRequestResponse {
  message: string
  id: number
  user?: string
}

export interface UpdateApprovalRequestResponse {
  message: string
  id: number
  user?: string
}

export interface ApprovalRequestActionResponse {
  message: string
  id: number
  user?: string
}

export interface GetApprovalRequestsParams {
  limit?: number
  offset?: number
  status?: string
  category_id?: number
}

export const approvalRequestsApi = {
  getAll: (params?: GetApprovalRequestsParams) =>
    api.get<ApprovalRequestsResponse>('/api/approval/requests', { params }),

  getToReview: (params?: GetApprovalRequestsParams) =>
    api.get<ApprovalRequestsResponse>('/api/approval/requests/to-review', {
      params,
    }),

  getById: (id: number) =>
    api.get<ApprovalRequestDetailResponse>(`/api/approval/requests/${id}`),

  create: (data: CreateApprovalRequestInput) =>
    api.post<CreateApprovalRequestResponse>('/api/approval/requests', data),

  update: (id: number, data: UpdateApprovalRequestInput) =>
    api.put<UpdateApprovalRequestResponse>(`/api/approval/requests/${id}`, data),

  cancel: (id: number) =>
    api.post<ApprovalRequestActionResponse>(
      `/api/approval/requests/${id}/cancel`
    ),

  approve: (id: number) =>
    api.post<ApprovalRequestActionResponse>(
      `/api/approval/requests/${id}/approve`
    ),

  reject: (id: number) =>
    api.post<ApprovalRequestActionResponse>(
      `/api/approval/requests/${id}/reject`
    ),
}

