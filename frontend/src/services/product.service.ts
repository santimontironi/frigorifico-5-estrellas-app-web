import api from './api'
import type { ImportProductsResponse, ProductResponse } from '../types/products.types'

export const importProductsService = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<ImportProductsResponse>('/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getProductsService = () => {
  return api.get<ProductResponse>('/products')
}
