import type { z } from 'zod'
import type { loginSchema, userRegisterSchema, authResponseSchema } from '../../../shared/index.js'

// Derivados de los schemas de `shared` — única fuente de verdad con el back.
export type AuthInterface = z.infer<typeof authResponseSchema>
export type LoginResponse = AuthInterface

export type LoginCredentials = z.infer<typeof loginSchema>
export type UserRegisterCredentials = z.infer<typeof userRegisterSchema>

export interface UserAddress {
  street: string
  number: string
  floor?: string
  apartment?: string
  city: string
  province: string
}

export interface UserDashboardResponse {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dni: string
  address: UserAddress
  createdAt: string
}

export interface AdminDashboardResponse {
  _id: string
  email: string
}

export type ProfileResponse = UserDashboardResponse | AdminDashboardResponse

export interface AuthLoadingState {
  me: boolean
  login: boolean
  logout: boolean
  registerUser: boolean
  confirmUser: boolean
}