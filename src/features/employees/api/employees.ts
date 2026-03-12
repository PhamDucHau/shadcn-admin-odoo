import { api } from '@/lib/api'
import type { Employee, EmployeeDetail, CreateEmployeeInput, UpdateEmployeeInput } from '../data/schema'

export interface EmployeesResponse {
  data: Employee[]
  count: number
  user: string
}

export interface EmployeeDetailResponse {
  data: EmployeeDetail
  user: string
}

export interface CreateEmployeeResponse {
  message: string
  id: number
  user: string
}

export interface UpdateEmployeeResponse {
  message: string
  id: number
  user: string
}

export interface DeleteEmployeeResponse {
  message: string
  id: number
  user: string
}

export interface GetEmployeesParams {
  limit?: number
  offset?: number
  fields?: string
}

export const employeesApi = {
  getAll: (params?: GetEmployeesParams) =>
    api.get<EmployeesResponse>('/api/employees', { params }),

  getById: (id: number) =>
    api.get<EmployeeDetailResponse>(`/api/employees/${id}`),

  create: (data: CreateEmployeeInput) =>
    api.post<CreateEmployeeResponse>('/api/employees', data),

  update: (id: number, data: UpdateEmployeeInput) =>
    api.put<UpdateEmployeeResponse>(`/api/employees/${id}`, data),

  delete: (id: number) =>
    api.delete<DeleteEmployeeResponse>(`/api/employees/${id}`),
}
