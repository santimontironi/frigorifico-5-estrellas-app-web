import { z } from "zod";
import { userDashboardResponseSchema, addressSchema } from "./auth.schema.js";

// Modal de "olvidé mi contraseña": el usuario ingresa su email y el back envía el enlace.
export const ChangePasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
});

// Página /cambiar-clave/:token: el usuario define su nueva contraseña.
export const ResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

// PUT /api/profile: body para editar el perfil del usuario.
// Incluye email (con re-confirmación en el back). No incluye dni (documento de
// identidad) ni password (tiene su propio flujo con ResetPasswordSchema).
export const EditProfileSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  phone: z.string().trim().regex(/^\d{8,15}$/, "Teléfono inválido (solo números, 8 a 15 dígitos)"),
  address: addressSchema,
});

export const EditProfileResponseSchema = z.object({
  profileEdited: userDashboardResponseSchema,
  emailChanged: z.boolean(),
  message: z.string(),
});

