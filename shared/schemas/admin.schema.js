import { z } from 'zod'

// Respuesta de GET /api/admin/employees: listado de cuentas con rol 'employee'.
export const employeeResponseSchema = z.object({
  _id:       z.string(),
  email:     z.string(),
  role:      z.string(),
  createdAt: z.string(),
})

export const employeesResponseSchema = z.array(employeeResponseSchema)
