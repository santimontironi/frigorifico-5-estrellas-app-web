import { z } from 'zod'
import { productSchema, getProductsResponseSchema, importProductsResponseSchema, updateProductSchema } from '../../../shared/index.js'

export type Product = z.infer<typeof productSchema>

export type ProductResponse = z.infer<typeof getProductsResponseSchema>

export type ImportProductsResponse = z.infer<typeof importProductsResponseSchema>

// entrada del form (price aún sin coercionar) vs. salida validada (price ya number)
export type UpdateProductInput = z.input<typeof updateProductSchema>
export type UpdateProductCredentials = z.infer<typeof updateProductSchema>

export type ProductsLoading = {
  get: boolean,
  update: boolean,
  delete: boolean,
  import: boolean
}


