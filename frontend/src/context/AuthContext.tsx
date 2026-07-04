import { createContext, useState, useEffect } from 'react'

import type { AuthInterface, LoginResponse, LoginCredentials, UserRegisterCredentials, AuthLoadingState } from '../types/auth.types'

import { authMeService, loginService, logoutService, registerUserService, confirmUserService } from '../services/auth.service'

interface AuthContextType {
  loading: AuthLoadingState
  auth: AuthInterface | null
  isUser: boolean
  isAdmin: boolean
  login: (credentials: LoginCredentials) => Promise<LoginResponse>
  confirmUser: (token: string) => Promise<void>
  logout: () => Promise<void>
  registerUser: (credentials: UserRegisterCredentials) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthContextProvider = ({ children }: { children: any }) => {

  const [auth, setAuth] = useState<AuthInterface | null>(null)

  const [loading, setLoading] = useState<AuthLoadingState>({
    me: true,
    login: false,
    logout: false,
    confirmUser: false,
    registerUser: false
  })

  useEffect(() => {
    async function me() {
      try {
        const res = await authMeService()
        setAuth(res)
      } catch {
        setAuth(null)
      } finally {
        setLoading(prev => ({ ...prev, me: false }))
      }
    }
    me()
  }, [])

  async function login(credentials: LoginCredentials) {
    try {
      setLoading(prev => ({ ...prev, login: true }))
      const res = await loginService(credentials)
      setAuth(res)
      return res
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, login: false }))
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
      isAdmin: auth?.role === 'admin',
      login,
      logout,
      confirmUser,
      registerUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
