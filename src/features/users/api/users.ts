import { api } from '@/lib/api'
import type {
  User,
  UserDetail,
  CreateUserInput,
  UpdateUserInput,
} from '../data/schema'

export interface UsersResponse {
  data: User[]
  count: number
  user: string
}

export interface UserDetailResponse {
  data: UserDetail
  user: string
}

export interface CreateUserResponse {
  message: string
  id: number
  user: string
}

export interface UpdateUserResponse {
  message: string
  id: number
  user: string
}

export interface ChangePasswordResponse {
  message: string
  user: string
}

export interface DeleteUserResponse {
  message: string
  id: number
  user: string
}

export interface GetUsersParams {
  limit?: number
  offset?: number
  search?: string
}

export const usersApi = {
  getAll: (params?: GetUsersParams) =>
    api.get<UsersResponse>('/api/users', { params }),

  getById: (id: number) => api.get<UserDetailResponse>(`/api/users/${id}`),

  create: (data: CreateUserInput) =>
    api.post<CreateUserResponse>('/api/users', data),

  update: (id: number, data: UpdateUserInput) =>
    api.put<UpdateUserResponse>(`/api/users/${id}`, data),

  changePassword: (id: number, new_password: string) =>
    api.post<ChangePasswordResponse>(`/api/users/${id}/change-password`, {
      new_password,
    }),

  delete: (id: number) => api.delete<DeleteUserResponse>(`/api/users/${id}`),
}
