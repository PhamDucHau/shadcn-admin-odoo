import { api } from '@/lib/api'
import type {
  ApprovalType,
  CreateApprovalTypeInput,
  UpdateApprovalTypeInput,
} from '../data/schema'

export interface ApprovalTypesResponse {
  data: ApprovalType[]
  count: number
  user?: string
}

export interface ApprovalTypeDetailResponse {
  data: ApprovalType
  user?: string
}

export interface CreateApprovalTypeResponse {
  message: string
  id: number
  user?: string
}

export interface UpdateApprovalTypeResponse {
  message: string
  id: number
  user?: string
}

export interface DeleteApprovalTypeResponse {
  message: string
  id: number
  user?: string
}

export interface GetApprovalTypesParams {
  limit?: number
  offset?: number
  search?: string
}

export const approvalTypesApi = {
  getAll: (params?: GetApprovalTypesParams) =>
    api.get<ApprovalTypesResponse>('/api/approval/types', { params }),

  getById: (id: number) =>
    api.get<ApprovalTypeDetailResponse>(`/api/approval/types/${id}`),

  create: (data: CreateApprovalTypeInput) =>
    api.post<CreateApprovalTypeResponse>('/api/approval/types', data),

  update: (id: number, data: UpdateApprovalTypeInput) =>
    api.put<UpdateApprovalTypeResponse>(`/api/approval/types/${id}`, data),

  delete: (id: number) =>
    api.delete<DeleteApprovalTypeResponse>(`/api/approval/types/${id}`),
}

