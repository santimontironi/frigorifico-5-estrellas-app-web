import { createContext, useState } from 'react'

import type { UserLoadingState } from '../types/user.types'

import { sendMailChangePassword, changePassword as changePasswordService } from '../services/user.service'

interface UserContextType {
  loading: UserLoadingState
  inputMail: (email: string) => Promise<void>
  changePassword: (token: string, newPassword: string) => Promise<void>
}

export const UserContext = createContext<UserContextType | null>(null)

export const UserContextProvider = ({ children }: { children: any }) => {

  const [loading, setLoading] = useState<UserLoadingState>({
    inputMail: false,
    changePassword: false
  })

  async function inputMail(email: string) {
    try {
      setLoading(prev => ({ ...prev, inputMail: true }))
      await sendMailChangePassword(email)
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, inputMail: false }))
    }
  }

  async function changePassword(token: string, newPassword: string) {
    try {
      setLoading(prev => ({ ...prev, changePassword: true }))
      await changePasswordService(token, newPassword)
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, changePassword: false }))
    }
  }

  return (
    <UserContext.Provider value={{
      loading,
      inputMail,
      changePassword,
    }}>
      {children}
    </UserContext.Provider>
  )
}
