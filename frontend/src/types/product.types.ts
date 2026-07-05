import { z } from 'zod'
import { productSchema, getProductsResponseSchema, importProductsResponseSchema } from '../../../shared/index.js'

export type Product = z.infer<typeof productSchema>

export type ProductResponse = z.infer<typeof getProductsResponseSchema>

export type ImportProductsResponse = z.infer<typeof importProductsResponseSchema>

export type ProductsLoading = {
  get: boolean
}
