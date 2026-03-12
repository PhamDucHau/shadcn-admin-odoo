import { api } from '@/lib/api'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginUser {
  username: string
  uid: number
  groups: number[]
  is_superuser: boolean
}

export interface LoginResponse {
  message: string
  token: string
  user: LoginUser
}

export interface MeResponse {
  username: string
  uid: number
  groups: number[]
  is_superuser: boolean
}

export const authApi = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/login', data),
  getMe: () => api.get<MeResponse>('/me'),
}
