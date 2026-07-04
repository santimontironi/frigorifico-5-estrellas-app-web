import api from './api'
import { authResponseSchema } from '../../../shared/index.js'
import type { LoginCredentials, UserRegisterCredentials, ProfileResponse } from '../types/auth.types'

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

export const getProfileService = () => api.get<ProfileResponse>('/profile')

export const confirmUserService = (token: string) => api.get(`/confirm/${token}`)
