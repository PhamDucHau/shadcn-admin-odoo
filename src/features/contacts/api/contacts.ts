import { api } from '@/lib/api'
import type {
  Contact,
  ContactDetail,
  CreateContactInput,
  UpdateContactInput,
} from '../data/schema'

export interface ContactsResponse {
  data: Contact[]
  count: number
  user: string
}

export interface ContactDetailResponse {
  data: ContactDetail
  user: string
}

export interface CreateContactResponse {
  message: string
  id: number
  user: string
}

export interface UpdateContactResponse {
  message: string
  id: number
  user: string
}

export interface DeleteContactResponse {
  message: string
  id: number
  user: string
}

export interface GetContactsParams {
  limit?: number
  offset?: number
  search?: string
}

export const contactsApi = {
  getAll: (params?: GetContactsParams) =>
    api.get<ContactsResponse>('/api/contacts', { params }),

  getById: (id: number) =>
    api.get<ContactDetailResponse>(`/api/contacts/${id}`),

  create: (data: CreateContactInput) =>
    api.post<CreateContactResponse>('/api/contacts', data),

  update: (id: number, data: UpdateContactInput) =>
    api.put<UpdateContactResponse>(`/api/contacts/${id}`, data),

  delete: (id: number) =>
    api.delete<DeleteContactResponse>(`/api/contacts/${id}`),
}
