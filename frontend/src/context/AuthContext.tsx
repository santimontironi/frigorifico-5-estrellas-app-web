import { createContext, useState, useEffect } from 'react'

import type { AuthInterface, LoginResponse, UserLoginCredentials, AdminLoginCredentials, UserRegisterCredentials, AuthLoadingState } from '../types/auth.types'

import { authMeService, loginUserService, loginAdminService, logoutService, registerUserService, confirmUserService } from '../services/auth.service'

interface AuthContextType {
  loading: AuthLoadingState
  auth: AuthInterface | null
  isUser: boolean
  loginUser: (credentials: UserLoginCredentials) => Promise<LoginResponse>
  loginAdmin: (credentials: AdminLoginCredentials) => Promise<LoginResponse>
  confirmUser: (token: string) => Promise<void>
  logout: () => Promise<void>
  registerUser: (credentials: UserRegisterCredentials) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthContextProvider = ({ children }: { children: any }) => {

  const [auth, setAuth] = useState<AuthInterface | null>(null)
  
  const [loading, setLoading] = useState<AuthLoadingState>({
    me: true,
    loginUser: false,
    loginAdmin: false,
    logout: false,
    confirmUser: false,
    registerUser: false
  })

  useEffect(() => {
    async function me() {
      try {
        const res = await authMeService()
        setAuth(res.data)
      } catch {
        setAuth(null)
      } finally {
        setLoading(prev => ({ ...prev, me: false }))
      }
    }
    me()
  }, [])

  async function loginUser(credentials: UserLoginCredentials) {
    try {
      setLoading(prev => ({ ...prev, loginUser: true }))
      const res = await loginUserService(credentials)
      setAuth(res.data)
      return res.data
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, loginUser: false }))
    }
  }

  async function loginAdmin(credentials: AdminLoginCredentials) {
    try {
      setLoading(prev => ({ ...prev, loginAdmin: true }))
      const res = await loginAdminService(credentials)
      setAuth(res.data)
      return res.data
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, loginAdmin: false }))
    }
  }

  async function logout() {
    try {
      setLoading(prev => ({ ...prev, logout: true }))
      await logoutService()
      setAuth(null)
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, logout: false }))
    }
  }

  async function registerUser(credentials: UserRegisterCredentials) {
    try {
      setLoading(prev => ({ ...prev, registerUser: true }))
      await registerUserService(credentials)
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, registerUser: false }))
    }
  }

  async function confirmUser(token: string){
    try{
      setLoading(prev => ({ ...prev, confirmUser: true }))
      await confirmUserService(token)
    }
    catch(error: any){
      throw error
    }
    finally{
      setLoading(prev => ({ ...prev, confirmUser: false }))
    }
  }

  return (
    <AuthContext.Provider value={{
      auth,
      loading,
      isUser: auth?.role === 'user',
      loginUser,
      loginAdmin,
      logout,
      confirmUser,
      registerUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
