import {z} from "zod"

// Modal de "olvidé mi contraseña": el usuario ingresa su email y el back envía el enlace.
export const ChangePasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email('Email inválido')
})

// Página /cambiar-clave/:token: el usuario define su nueva contraseña.
export const ResetPasswordSchema = z.object({
    newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})