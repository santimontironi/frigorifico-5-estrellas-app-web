import { createContext, useState, useEffect } from 'react'

import type { AuthInterface, LoginResponse, UserLoginCredentials, AdminLoginCredentials, UserRegisterCredentials, UserDashboardResponse, AdminDashboardResponse, AuthLoadingState } from '../types/auth.types'

import { authMeService, loginUserService, loginAdminService, logoutUserService, logoutAdminService, registerUserService, getUserDashboardService, getAdminDashboardService } from '../services/auth.service'

interface AuthContextType {
  loading: AuthLoadingState
  auth: AuthInterface | null
  isAdmin: boolean
  loginUser: (credentials: UserLoginCredentials) => Promise<LoginResponse>
  loginAdmin: (credentials: AdminLoginCredentials) => Promise<LoginResponse>
  logoutUser: () => Promise<void>
  logoutAdmin: () => Promise<void>
  registerUser: (credentials: UserRegisterCredentials) => Promise<void>
  dashboardUser: () => Promise<UserDashboardResponse>
  dashboardAdmin: () => Promise<AdminDashboardResponse>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthContextProvider = ({ children }: { children: any }) => {

  const [auth, setAuth] = useState<AuthInterface | null>(null)
  const [loading, setLoading] = useState<AuthLoadingState>({
    me: true,
    loginUser: false,
    loginAdmin: false,
    logoutUser: false,
    logoutAdmin: false,
    registerUser: false,
    dashboardUser: false,
    dashboardAdmin: false
  })

  useEffect(() => {
    async function me() {
      try {
        setLoading({ ...loading, me: true })
        const res = await authMeService()
        setAuth(res.data)
      } catch (error: any) {
        setAuth(null)
      } finally {
        setLoading({ ...loading, me: false })
      }
    }
    me()
  }, [])

  async function loginUser(credentials: UserLoginCredentials) {
    try {
      setLoading({ ...loading, loginUser: true })
      const res = await loginUserService(credentials)
      setAuth(res.data)
      return res.data
    } catch (error: any) {
      throw error
    } finally {
      setLoading({ ...loading, loginUser: false })
    }
  }

  async function loginAdmin(credentials: AdminLoginCredentials) {
    try {
      setLoading({ ...loading, loginAdmin: true })
      const res = await loginAdminService(credentials)
      setAuth(res.data)
      return res.data
    } catch (error: any) {
      throw error
    } finally {
      setLoading({ ...loading, loginAdmin: false })
    }
  }

  async function logoutUser() {
    try {
      setLoading({ ...loading, logoutUser: true })
      await logoutUserService()
      setAuth(null)
    } catch (error: any) {
      throw error
    } finally {
      setLoading({ ...loading, logoutUser: false })
    }
  }

  async function logoutAdmin() {
    try {
      setLoading({ ...loading, logoutAdmin: true })
      await logoutAdminService()
      setAuth(null)
    } catch (error: any) {
      throw error
    } finally {
      setLoading({ ...loading, logoutAdmin: false })
    }
  }

  async function registerUser(credentials: UserRegisterCredentials) {
    try {
      setLoading({ ...loading, registerUser: true })
      await registerUserService(credentials)
    } catch (error: any) {
      throw error
    } finally {
      setLoading({ ...loading, registerUser: false })
    }
  }

  async function dashboardUser() {
    try {
      setLoading({ ...loading, dashboardUser: true })
      const res = await getUserDashboardService()
      return res.data
    } catch (error: any) {
      throw error
    } finally {
      setLoading({ ...loading, dashboardUser: false })
    }
  }

  async function dashboardAdmin() {
    try {
      setLoading({ ...loading, dashboardAdmin: true })
      const res = await getAdminDashboardService()
      return res.data
    } catch (error: any) {
      throw error
    } finally {
      setLoading({ ...loading, dashboardAdmin: false })
    }
  }

  return (
    <AuthContext.Provider value={{
      auth,
      loading,
      isAdmin: auth?.role === 'admin',
      loginUser,
      loginAdmin,
      logoutUser,
      logoutAdmin,
      registerUser,
      dashboardUser,
      dashboardAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}
