import { createContext, useState, useEffect } from 'react'
import type { CartItem } from '../types/cart.types'
import type { Product } from '../types/product.types'

const CART_STORAGE_KEY = 'cart'

type CartContextType = {
  items: CartItem[]
  total: number
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextType | null>(null)

export const CartContextProvider = ({ children }: any) => {

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.product._id === product._id)

      if (existing) {
        const newQuantity = existing.quantity + quantity
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity, subtotal: newQuantity * product.price }
            : item
        )
      }

      return [...prev, { product, quantity, subtotal: quantity * product.price }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product._id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev => prev.map(item =>
      item.product._id === productId
        ? { ...item, quantity, subtotal: quantity * item.product.price }
        : item
    ))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((acc, item) => acc + item.subtotal, 0)

  return (
    <CartContext.Provider value={{ items, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
