import { z } from 'zod'
import { productSchema, importProductsResponseSchema, updateProductSchema, createProductSchema } from '../../../shared/index.js'

export type Product = z.infer<typeof productSchema>

export type ImportProductsResponse = z.infer<typeof importProductsResponseSchema>

// entrada del form (price aún sin coercionar) vs. salida validada (price ya number)
export type UpdateProductInput = z.input<typeof updateProductSchema>
export type UpdateProductCredentials = z.infer<typeof updateProductSchema>

// entrada del form (price aún string) vs. salida validada (price ya number)
export type CreateProductInput = z.input<typeof createProductSchema>
export type CreateProductCredentials = z.infer<typeof createProductSchema>

export type ProductsLoading = {
  get: boolean,
  update: boolean,
  delete: boolean,
  import: boolean,
  create: boolean
}