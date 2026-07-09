import api from './api'
import { getProductsResponseSchema, importProductsResponseSchema, deleteProductResponseSchema, updateProductResponseSchema, createProductResponseSchema } from '../../../shared/index.js'

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

// Recibe FormData porque puede incluir una imagen (opcional) además de los campos editables.
// Axios detecta el FormData y setea el multipart con boundary automáticamente.
export const editProductService = async (id: string, data: FormData) => {
  const res = await api.patch(`/products/${id}`, data)
  return updateProductResponseSchema.parse(res.data)
}

export const deleteProductService = async (id: string) => {
  const res = await api.delete(`/products/${id}`)
  return deleteProductResponseSchema.parse(res.data)
}

export const createProductService = async (data: FormData) => {
  const res = await api.post('/products', data)
  return createProductResponseSchema.parse(res.data)
}