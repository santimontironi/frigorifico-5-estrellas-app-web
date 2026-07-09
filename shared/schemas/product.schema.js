import {z} from "zod"
import {categorySchema} from "./category.schema.js"

export const productSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, 'El nombre es obligatorio'),
    category: categorySchema,
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    unit: z.enum(['kg', 'unit'], 'La unidad debe ser "kg" o "unit"'),
    image: z.string().nullable().optional(), // URL de Cloudinary — opcional
    active: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export const createProductSchema = z.object({
    image: z.string().optional().nullable(), //nullable para que no sea obligatorio
    name: z.string().min(1, 'El nombre es obligatorio'),
    category: z.string().min(1, 'La categoría es obligatoria'),
    price: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0'),
    unit: z.enum(['kg', 'unit'], 'La unidad debe ser "kg" o "unit"'),
})

export const createProductResponseSchema = z.object({
    product: productSchema
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

// PUT /api/products/:id — body de la request (campos editables, category como id).
// La imagen NO va acá: viaja como archivo (multer) y se sube a Cloudinary en el controller.
export const updateProductSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    category: z.string().min(1, 'La categoría es obligatoria'),
    // Recorrido del price: string (input) -> number (validar) -> string (FormData) -> number (guardar).
    // coerce convierte string a number, así valida igual en el front (input da string) y en el back (FormData da string).
    price: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0'),
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