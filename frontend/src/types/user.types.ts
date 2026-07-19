import {ChangePasswordSchema, ResetPasswordSchema, EditProfileSchema, EditProfileResponseSchema} from "../../../shared/index"
import {z} from "zod"

export interface UserLoadingState {
  inputMail: boolean
  changePassword: boolean
  profile: boolean
  editProfile: boolean
}

export type ChangePasswordCredentiales = z.infer<typeof ChangePasswordSchema>

export type ResetPasswordCredentials = z.infer<typeof ResetPasswordSchema>

export type EditProfileCredentials = z.infer<typeof EditProfileSchema>

export type EditProfileResponse = z.infer<typeof EditProfileResponseSchema>
