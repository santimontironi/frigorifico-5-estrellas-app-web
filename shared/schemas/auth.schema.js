import { z } from 'zod'

// Dirección: reutilizada por el registro de usuario.
// Los campos opcionales (floor/apartment) coinciden con el modelo de Mongoose.
export const addressSchema = z.object({
  street:    z.string().trim().min(1, 'La calle es obligatoria'),
  number:    z.string().trim().min(1, 'El número es obligatorio'),
  floor:     z.string().trim().optional(),
  apartment: z.string().trim().optional(),
  city:      z.string().trim().min(1, 'La ciudad es obligatoria'),
  province:  z.string().trim().min(1, 'La provincia es obligatoria'),
})

// POST /api/login
export const loginSchema = z.object({
  email:    z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

// POST /api/register/user
export const userRegisterSchema = z.object({
  firstName: z.string().trim().min(2, 'El nombre es obligatorio'),
  lastName:  z.string().trim().min(2, 'El apellido es obligatorio'),
  dni:       z.string().trim().regex(/^\d{7,8}$/, 'DNI inválido (7 u 8 dígitos)'),
  phone:     z.string().trim().min(6, 'Teléfono inválido'),
  email:     z.string().trim().toLowerCase().email('Email inválido'),
  password:  z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  address:   addressSchema,
})

// POST /api/register/admin
export const adminRegisterSchema = z.object({
  email:    z.string().trim().toLowerCase().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

// Respuesta de sesión: la devuelven GET /api/me y POST /api/login.
export const authResponseSchema = z.object({
  id:   z.string(),
  role: z.enum(['user', 'admin', 'employee']),
})

export const userDashboardResponseSchema = z.object({
  _id:       z.string(),
  firstName: z.string(),
  lastName:  z.string(),
  dni:       z.string(),
  phone:     z.string(),
  email:     z.string(),
  address:   addressSchema,
  createdAt: z.string(),
})

export const adminDashboardResponseSchema = z.object({
  _id:   z.string(),
  email: z.string(),
})

// Respuesta de GET /api/profile: puede ser un usuario o un admin. union es un or.
export const profileResponseSchema = z.union([
  userDashboardResponseSchema,
  adminDashboardResponseSchema,
])

// Respuesta de GET /api/employees: listado de cuentas con rol 'employee'.
export const employeeResponseSchema = z.object({
  _id:       z.string(),
  email:     z.string(),
  role:      z.string(),
  createdAt: z.string(),
})

export const employeesResponseSchema = z.array(employeeResponseSchema)
