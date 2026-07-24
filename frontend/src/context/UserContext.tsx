import { createContext, useState } from 'react'

import type { UserLoadingState, EditProfileCredentials, EditProfileResponse } from '../types/user.types'
import type { ProfileResponse } from '../types/auth.types'

import { sendMailChangePassword, changePassword as changePasswordService } from '../services/user.service'
import { getProfileService } from '../services/auth.service'
import { editProfileService } from '../services/user.service'

interface UserContextType {
  loading: UserLoadingState
  profile: ProfileResponse | null
  error: string | null
  inputMail: (email: string) => Promise<void>
  changePassword: (token: string, newPassword: string) => Promise<void>
  fetchProfile: () => Promise<void>
  editProfile: (data: EditProfileCredentials) => Promise<EditProfileResponse>
}

export const UserContext = createContext<UserContextType | null>(null)

export const UserContextProvider = ({ children }: { children: any }) => {

  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [loading, setLoading] = useState<UserLoadingState>({
    inputMail: false,
    changePassword: false,
    profile: true,
    editProfile: false
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

  async function fetchProfile() {
    try {
      setLoading(prev => ({ ...prev, profile: true }))
      const res = await getProfileService()
      setProfile(res)
    } catch (error: any) {
      setError(error?.response?.data?.message)
    } finally {
      setLoading(prev => ({ ...prev, profile: false }))
    }
  }

  async function editProfile(data: EditProfileCredentials) {
    try {
      setLoading(prev => ({ ...prev, editProfile: true }))
      const res = await editProfileService(data)
      setProfile(res.profileEdited)
      return res
    } catch (error: any) {
      throw error
    } finally {
      setLoading(prev => ({ ...prev, editProfile: false }))
    }
  }

  return (
    <UserContext.Provider value={{
      loading,
      profile,
      error,
      inputMail,
      changePassword,
      fetchProfile,
      editProfile,
    }}>
      {children}
    </UserContext.Provider>
  )
}
