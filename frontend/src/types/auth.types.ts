import type { z } from 'zod'
import type { loginSchema, userRegisterSchema, authResponseSchema, addressSchema, profileResponseSchema } from '../../../shared/index.js'

// Estos son los tipos derivados de los schemas de `shared` — única fuente de verdad con el back.
export type AuthInterface = z.infer<typeof authResponseSchema>

export type LoginResponse = AuthInterface

export type LoginCredentials = z.infer<typeof loginSchema>

export type UserRegisterCredentials = z.infer<typeof userRegisterSchema>

export type UserAddress = z.infer<typeof addressSchema>

export type ProfileResponse = z.infer<typeof profileResponseSchema>

// Este tipo es creado manualmente, no viene de shared
export interface AuthLoadingState {
  me: boolean
  login: boolean
  logout: boolean
  registerUser: boolean
  confirmUser: boolean
  registerEmployee: boolean
}