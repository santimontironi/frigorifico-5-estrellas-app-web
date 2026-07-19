import { createContext, useState } from 'react'

import type { UserLoadingState, EditProfileCredentials, EditProfileResponse } from '../types/user.types'
import type { ProfileResponse } from '../types/auth.types'

import { sendMailChangePassword, changePassword as changePasswordService } from '../services/user.service'
import { getProfileService, editProfileService } from '../services/auth.service'

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

  // El loading arranca en true en cada llamada, no sólo la primera: como el estado
  // ahora vive en el provider y sobrevive al desmontaje de los paneles, sin esto
  // se vería el perfil anterior por un instante al volver a entrar.
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

  // Pisa el perfil con lo que devuelve el back, así la vista refresca sin volver
  // a pedirlo. Devuelve la respuesta completa porque el modal necesita saber si
  // cambió el email para cerrar la sesión.
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
