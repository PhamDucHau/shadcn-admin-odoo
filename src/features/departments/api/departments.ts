import { api } from '@/lib/api'
import type {
  Department,
  DepartmentDetail,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from '../data/schema'

export interface DepartmentsResponse {
  data: Department[]
  count: number
  user: string
}

export interface DepartmentDetailResponse {
  data: DepartmentDetail
  user: string
}

export interface CreateDepartmentResponse {
  message: string
  id: number
  user: string
}

export interface UpdateDepartmentResponse {
  message: string
  id: number
  user: string
}

export interface DeleteDepartmentResponse {
  message: string
  id: number
  user: string
}

export interface GetDepartmentsParams {
  limit?: number
  offset?: number
}

export const departmentsApi = {
  getAll: (params?: GetDepartmentsParams) =>
    api.get<DepartmentsResponse>('/api/departments', { params }),

  getById: (id: number) =>
    api.get<DepartmentDetailResponse>(`/api/departments/${id}`),

  create: (data: CreateDepartmentInput) =>
    api.post<CreateDepartmentResponse>('/api/departments', data),

  update: (id: number, data: UpdateDepartmentInput) =>
    api.put<UpdateDepartmentResponse>(`/api/departments/${id}`, data),

  delete: (id: number) =>
    api.delete<DeleteDepartmentResponse>(`/api/departments/${id}`),
}
