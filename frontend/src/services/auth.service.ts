import api from './api'
import { authResponseSchema, profileResponseSchema, employeesResponseSchema } from '../../../shared/index.js'
import type { LoginCredentials, UserRegisterCredentials, EmployeeRegisterCredentials } from '../types/auth.types'

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

export const getEmployeesService = async () => {
  const res = await api.get('/employees')
  return employeesResponseSchema.parse(res.data)
}

export const getProfileService = async () => {
  const res = await api.get('/profile')
  return profileResponseSchema.parse(res.data)
}

export const confirmUserService = (token: string) => api.get(`/confirm/${token}`)
