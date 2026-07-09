import {z} from 'zod'

export const categorySchema = z.object({
    _id: z.string(),
    name: z.string().min(1, 'El nombre es obligatorio')
})

export const getAllCategoriesResponseSchema = z.object({
    categories: z.array(categorySchema)
})

export const createCategorySchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio')
})

export const createCategoryResponseSchema = z.object({
    category: categorySchema
})