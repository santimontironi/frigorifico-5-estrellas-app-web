import { createContext, useState, useEffect, useContext } from 'react'
import type { CartItem } from '../types/cart.types'
import type { Product } from '../types/product.types'
import { OfferContext } from './OfferContext'

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

  const offerContext = useContext(OfferContext)

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

  // Si se entra directo a /carrito sin pasar por el Home, las ofertas nunca se pidieron.
  useEffect(() => {
    if (offerContext && offerContext.offers.length === 0 && !offerContext.loading.get) {
      offerContext.getOffers()
    }
  }, [])

  // Misma regla que el back: la oferta aplica solo si la cantidad supera el mínimo.
  const getUnitPrice = (product: Product, quantity: number) => {
    const offer = offerContext?.offers.find(o => o.product._id === product._id)
    return offer && quantity >= offer.minQuantity ? offer.newPrice : product.price
  }

  // Si las ofertas todavía no cargaron (ej: se entra directo a /carrito), recalculamos
  // los subtotales apenas llegan, para no dejar precios viejos en un carrito persistido.
  useEffect(() => {
    if (items.length === 0) return
    setItems(prev => prev.map(item => ({
      ...item,
      subtotal: item.quantity * getUnitPrice(item.product, item.quantity),
    })))
  }, [offerContext?.offers])

  const addToCart = (product: Product, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.product._id === product._id)

      if (existing) {
        const newQuantity = existing.quantity + quantity
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity, subtotal: newQuantity * getUnitPrice(product, newQuantity) }
            : item
        )
      }

      return [...prev, { product, quantity, subtotal: quantity * getUnitPrice(product, quantity) }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product._id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev => prev.map(item =>
      item.product._id === productId
        ? { ...item, quantity, subtotal: quantity * getUnitPrice(item.product, quantity) }
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
