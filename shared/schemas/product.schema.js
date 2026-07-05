import {z} from "zod"
import {categorySchema} from "./category.schema.js"

export const productSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, 'El nombre es obligatorio'),
    category: categorySchema,
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    unit: z.enum(['kg', 'unit'], 'La unidad debe ser "kg" o "unit"'),
    active: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export const deleteProductResponseSchema = z.object({
    product: productSchema
})

// GET /api/products
export const getProductsResponseSchema = z.object({
    products: z.array(productSchema)
})

// POST /api/products/import
export const importProductsResponseSchema = z.object({
    message: z.string(),
    inserted: z.number(),
    errors: z.array(z.string()),
})