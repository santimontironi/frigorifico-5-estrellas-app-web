import type { CartItem } from '../../types/cart.types'
import useCart from '../../hooks/useCart'

const formatPrice = (value: number) => `$${value.toLocaleString('es-AR')}`

const unitLabel = (unit: string) => (unit === 'kg' ? 'kg' : 'un')

interface ProductInCartProps {
  item: CartItem
}

const ProductInCart = ({ item }: ProductInCartProps) => {
  const { removeFromCart, updateQuantity } = useCart()
  const { product, quantity, subtotal } = item

  const handleDecrease = () => {
    if (quantity <= 1) {
      removeFromCart(product._id)
      return
    }
    updateQuantity(product._id, quantity - 1)
  }

  return (
    <li className="relative flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/8 bg-[#0F0507] p-4 md:p-5 transition-colors duration-300 hover:border-[#9B2335]/50">
      <div className="flex items-center justify-center shrink-0 w-14 h-14 rounded-xl bg-linear-to-br from-[#3A1119] via-[#1C0A0E] to-[#0A0A0A] border border-white/8">
        <i className="bi bi-tag-fill text-[#9B2335] text-lg" aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[#F2EDE6] text-base md:text-lg font-bold tracking-tight leading-snug truncate">
          {product.name}
        </h3>
        <p className="text-[#C9BFB5]/60 text-xs font-mono mt-1">
          {formatPrice(product.price)} <span className="text-[#C9BFB5]/40">/ {unitLabel(product.unit)}</span>
          <span className="mx-2 text-[#C9BFB5]/25">·</span>
          {product.category.name}
        </p>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#120A0C] p-1 shrink-0">
        <button
          type="button"
          onClick={handleDecrease}
          aria-label="Disminuir cantidad"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#C9BFB5] cursor-pointer hover:bg-[#9B2335]/20 hover:text-[#F2EDE6] transition-colors duration-200"
        >
          <i className="bi bi-dash-lg text-sm" aria-hidden="true" />
        </button>
        <span className="w-8 text-center text-[#F2EDE6] text-sm font-mono font-semibold tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(product._id, quantity + 1)}
          aria-label="Aumentar cantidad"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#C9BFB5] cursor-pointer hover:bg-[#9B2335]/20 hover:text-[#F2EDE6] transition-colors duration-200"
        >
          <i className="bi bi-plus-lg text-sm" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3 sm:gap-1 shrink-0 sm:w-28">
        <span className="text-[#F2EDE6] text-base md:text-lg font-bold font-mono tracking-tight tabular-nums">
          {formatPrice(subtotal)}
        </span>
        <button
          type="button"
          onClick={() => removeFromCart(product._id)}
          aria-label={`Eliminar ${product.name} del carrito`}
          className="flex items-center gap-1 text-[#C9BFB5]/50 text-xs cursor-pointer hover:text-[#C9405A] transition-colors duration-200"
        >
          <i className="bi bi-trash3" aria-hidden="true" />
          Quitar
        </button>
      </div>
    </li>
  )
}

export default ProductInCart
