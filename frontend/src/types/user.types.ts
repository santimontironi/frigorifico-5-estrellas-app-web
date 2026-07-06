import {ChangePasswordSchema, ResetPasswordSchema} from "../../../shared/index"
import {z} from "zod"

export interface UserLoadingState {
  inputMail: boolean
  changePassword: boolean
}

export type ChangePasswordCredentiales = z.infer<typeof ChangePasswordSchema>

export type ResetPasswordCredentials = z.infer<typeof ResetPasswordSchema>
