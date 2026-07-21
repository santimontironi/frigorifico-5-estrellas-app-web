import api from "./api";
import { EditProfileResponseSchema } from '../../../shared/index.js'
import type { EditProfileCredentials } from '../types/user.types'

export const sendMailChangePassword = async (email: string) => {
    return api.post('/change-password', { email })
}

export const changePassword = async (token: string, newPassword: string) => {
    return api.post(`/change-password/${token}`, { newPassword })
}

// Va JSON plano (no FormData): el perfil no tiene imagen.
// Si cambió el email, el back invalida la cookie y responde emailChanged: true.
export const editProfileService = async (data: EditProfileCredentials) => {
    const res = await api.patch('/profile', data)
    return EditProfileResponseSchema.parse(res.data)
}
