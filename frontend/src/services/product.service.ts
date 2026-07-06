import api from './api'
import { getProductsResponseSchema, importProductsResponseSchema } from '../../../shared/index.js'

export const importProductsService = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return importProductsResponseSchema.parse(res.data)
}

export const getProductsService = async () => {
  const res = await api.get('/products')
  return getProductsResponseSchema.parse(res.data)
}
