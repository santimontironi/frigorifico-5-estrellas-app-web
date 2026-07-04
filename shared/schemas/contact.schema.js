import { z } from 'zod'

// POST /api/contact
export const contactSchema = z.object({
  name:    z.string().trim().min(1, 'El nombre es obligatorio'),
  surname: z.string().trim().min(1, 'El apellido es obligatorio'),
  email:   z.string().trim().toLowerCase().email('Ingresá un email válido'),
  number:  z.string().trim().min(1, 'El teléfono es obligatorio'),
  message: z.string().trim().min(1, 'El mensaje es obligatorio'),
})
