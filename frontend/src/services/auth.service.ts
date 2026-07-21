import api from './api'
import { authResponseSchema, profileResponseSchema } from '../../../shared/index.js'
import type { LoginCredentials, UserRegisterCredentials } from '../types/auth.types'
import type { EmployeeRegisterCredentials } from '../types/admin.types'

export const authMeService = async () => {
  const res = await api.get('/me')
  return authResponseSchema.parse(res.data)
}

export const loginService = async (credentials: LoginCredentials) => {
  const res = await api.post('/login', credentials)
  return authResponseSchema.parse(res.data)
}

export const logoutService = () => api.post('/logout')

export const registerUserService = (credentials: UserRegisterCredentials) => api.post('/register/user', credentials)

export const registerEmployeeService = (credentials: EmployeeRegisterCredentials) => api.post('/register/employee', credentials)

export const getProfileService = async () => {
  const res = await api.get('/profile')
  return profileResponseSchema.parse(res.data)
}

export const confirmUserService = (token: string) => api.get(`/confirm/${token}`)
