export interface Product {
  _id: string
  name: string
  category: Category
  price: number
  createdAt: string
  unit: 'kg' | 'unit'
  updatedAt: string
}

export interface Category {
  name: string
}

export interface ProductResponse {
  products: Product[]
}

export interface ImportProductsResponse {
  message: string
  inserted: number
  errors: string[]
}

export interface ProductsLoading {
  get: boolean
}