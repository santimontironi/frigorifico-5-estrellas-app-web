import api from './api'
import type { AuthInterface, LoginResponse, UserLoginCredentials, AdminLoginCredentials, UserRegisterCredentials, UserDashboardResponse, AdminDashboardResponse } from '../types/auth.types'

export const authMeService = () => api.get<AuthInterface>('/me')

export const loginUserService = (credentials: UserLoginCredentials) => api.post<LoginResponse>('/login/user', credentials)

export const loginAdminService = (credentials: AdminLoginCredentials) => api.post<LoginResponse>('/login/admin', credentials)

export const logoutService = () => api.post('/logout')

export const registerUserService = (credentials: UserRegisterCredentials) => api.post('/register/user', credentials)

export const getUserDashboardService = () => api.get<UserDashboardResponse>('/dashboard/user')

export const getAdminDashboardService = () => api.get<AdminDashboardResponse>('/dashboard/admin')

export const confirmUserService = (token: string) => api.get(`/verificar/${token}`)