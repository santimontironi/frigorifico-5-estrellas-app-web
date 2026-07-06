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

// GET /api/products/:id
export const getProductResponseSchema = z.object({
    product: productSchema
})

// PUT /api/products/:id — body de la request (campos editables, category como id)
export const updateProductSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    category: z.string().min(1, 'La categoría es obligatoria'),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    unit: z.enum(['kg', 'unit'], 'La unidad debe ser "kg" o "unit"'),
})

// PUT /api/products/:id — respuesta
export const updateProductResponseSchema = z.object({
    product: productSchema
})

// POST /api/products/import
export const importProductsResponseSchema = z.object({
    message: z.string(),
    inserted: z.number(),
    errors: z.array(z.string()),
})