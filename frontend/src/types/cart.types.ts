import type { Product } from './product.types'

export type CartItem = {
  product: Product
  quantity: number
  subtotal: number
}
