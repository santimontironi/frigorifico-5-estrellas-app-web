import type { z } from 'zod'
import type { loginSchema, userRegisterSchema, authResponseSchema, addressSchema, profileResponseSchema, userDashboardResponseSchema } from '../../../shared/index.js'

// Estos son los tipos derivados de los schemas de `shared` — única fuente de verdad con el back.
export type AuthInterface = z.infer<typeof authResponseSchema>

export type LoginResponse = AuthInterface

export type LoginCredentials = z.infer<typeof loginSchema>

export type UserRegisterCredentials = z.infer<typeof userRegisterSchema>

export type UserAddress = z.infer<typeof addressSchema>

export type ProfileResponse = z.infer<typeof profileResponseSchema>

// La variante "user" del perfil: la que tiene nombre, dni, teléfono y dirección.
// ProfileResponse es una union (user | admin), así que este tipo evita tener que
// re-narrowear con `'firstName' in profile` en cada componente.
export type UserProfile = z.infer<typeof userDashboardResponseSchema>

// Este tipo es creado manualmente, no viene de shared
export interface AuthLoadingState {
  me: boolean
  login: boolean
  logout: boolean
  registerUser: boolean
  confirmUser: boolean
  registerEmployee: boolean
}