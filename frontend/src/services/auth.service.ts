import api from './api'
import type { AuthInterface, LoginResponse, LoginCredentials, UserRegisterCredentials, ProfileResponse } from '../types/auth.types'

export const authMeService = () => api.get<AuthInterface>('/me')

export const loginService = (credentials: LoginCredentials) => api.post<LoginResponse>('/login', credentials)

export const logoutService = () => api.post('/logout')

export const registerUserService = (credentials: UserRegisterCredentials) => api.post('/register/user', credentials)

export const getProfileService = () => api.get<ProfileResponse>('/profile')

export const confirmUserService = (token: string) => api.get(`/confirm/${token}`)
