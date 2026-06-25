import axios from 'axios'
import type { AuthInterface, LoginResponse, UserLoginCredentials, AdminLoginCredentials, UserRegisterCredentials, UserDashboardResponse, AdminDashboardResponse } from '../types/auth.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

export const authMeService = () => api.get<AuthInterface>('/auth/me')

export const loginUserService = (credentials: UserLoginCredentials) => api.post<LoginResponse>('/login/user', credentials)

export const loginAdminService = (credentials: AdminLoginCredentials) => api.post<LoginResponse>('/login/admin', credentials)

export const logoutUserService = () => api.post('/logout/user')

export const logoutAdminService = () => api.post('/logout/admin')

export const registerUserService = (credentials: UserRegisterCredentials) => api.post('/register/user', credentials)

export const getUserDashboardService = () => api.get<UserDashboardResponse>('/dashboard/user')

export const getAdminDashboardService = () => api.get<AdminDashboardResponse>('/dashboard/admin')