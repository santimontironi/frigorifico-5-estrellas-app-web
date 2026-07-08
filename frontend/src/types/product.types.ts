import { z } from 'zod'
import { productSchema, getProductsResponseSchema, importProductsResponseSchema, updateProductSchema, updateProductResponseSchema } from '../../../shared/index.js'

export type Product = z.infer<typeof productSchema>

export type ProductResponse = z.infer<typeof getProductsResponseSchema>

export type ImportProductsResponse = z.infer<typeof importProductsResponseSchema>

export type UpdateProductCredentials = z.infer<typeof updateProductSchema>

export type UpdateProductResponse = z.infer<typeof updateProductResponseSchema>

export type ProductsLoading = {
  get: boolean,
  update: boolean
}
