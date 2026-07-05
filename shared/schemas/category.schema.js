import {z} from 'zod'

export const categorySchema = z.object({
    _id: z.string(),
    name: z.string().min(1, 'El nombre es obligatorio'),
    createdAt: z.string(),
    updatedAt: z.string(),
})