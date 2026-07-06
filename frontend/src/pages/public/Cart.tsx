import { Link } from 'react-router-dom'
import Header from '../../components/ui/Header'
import DiagonalLines from '../../components/ui/DiagonalLines'
import useCart from '../../hooks/useCart'

const formatPrice = (value: number) => `$${value.toLocaleString('es-AR')}`

const unitLabel = (unit: string) => (unit === 'kg' ? 'kg' : 'un')

const Cart = () => {
  const { items, total, removeFromCart, updateQuantity, clearCart } = useCart()

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const isEmpty = items.length === 0

  const handleDecrease = (productId: string, quantity: number) => {
    if (quantity <= 1) {
      removeFromCart(productId)
      return
    }
    updateQuantity(productId, quantity - 1)
  }

  return (
    <section className="min-h-screen bg-[#0A0A0A]">
      <Header />

      <div className="relative overflow-hidden border-b border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]">
        <DiagonalLines />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:px-10 md:py-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-0.5 w-12 bg-[#9B2335] shadow-[0_0_12px_rgba(155,35,53,0.8)]" />
            <span className="text-[#9B2335] text-xs tracking-[0.3em] uppercase font-mono font-semibold">Tu carrito</span>
          </div>

          <h1 className="text-[#F2EDE6] text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
            Revisá <span className="text-[#C9405A] [text-shadow:0_0_28px_rgba(155,35,53,0.6)]">tu pedido</span>
          </h1>

          <p className="text-[#C9BFB5]/70 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            {isEmpty
              ? 'Todavía no agregaste cortes a tu carrito. Explorá nuestros productos y armá tu pedido.'
              : `Tenés ${itemCount} ${itemCount === 1 ? 'artículo' : 'artículos'} en tu carrito.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:px-10 md:py-20">

        {isEmpty ? (
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] px-6 py-16 md:py-24 text-center">
            <i className="bi bi-cart-x absolute -bottom-8 -right-6 text-[#9B2335]/10 text-[10rem] -rotate-12" aria-hidden="true" />

            <div className="relative z-10 flex flex-col items-center">
              <span className="flex items-center justify-center w-16 h-16 rounded-full border border-[#9B2335]/40 bg-[#9B2335]/10 mb-6">
                <i className="bi bi-cart3 text-[#C9405A] text-2xl" aria-hidden="true" />
              </span>
              <h2 className="text-[#F2EDE6] text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Tu carrito está vacío
              </h2>
              <p className="text-[#C9BFB5]/70 text-sm md:text-base max-w-md mb-8 leading-relaxed">
                Descubrí nuestros cortes premium y agregá lo que necesites para tu próximo pedido.
              </p>
              <Link
                to="/"
                className="flex items-center gap-2 bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
              >
                <i className="bi bi-arrow-left" aria-hidden="true" />
                Ver productos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 md:gap-16">

            <div className="xl:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <i className="bi bi-bag-check text-[#9B2335] text-sm" aria-hidden="true" />
                  <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Artículos</span>
                </div>
                <button
                  type="button"
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-[#C9BFB5]/60 text-xs tracking-wide uppercase cursor-pointer hover:text-[#C9405A] transition-colors duration-200"
                >
                  <i className="bi bi-trash3" aria-hidden="true" />
                  Vaciar carrito
                </button>
              </div>

              <ul className="space-y-4">
                {items.map(({ product, quantity, subtotal }) => (
                  <li
                    key={product._id}
                    className="relative flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-white/8 bg-[#0F0507] p-4 md:p-5 transition-colors duration-300 hover:border-[#9B2335]/50"
                  >
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
                        onClick={() => handleDecrease(product._id, quantity)}
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
                ))}
              </ul>

              <Link
                to="/"
                className="inline-flex items-center gap-2 mt-8 text-[#C9BFB5] text-xs tracking-[0.15em] uppercase font-medium hover:text-[#F2EDE6] transition-colors duration-200"
              >
                <i className="bi bi-arrow-left" aria-hidden="true" />
                Seguir comprando
              </Link>
            </div>

            <div className="xl:col-span-2">
              <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] p-6 md:p-8 xl:sticky xl:top-28">
                <i className="bi bi-receipt absolute -bottom-8 -right-6 text-[#9B2335]/10 text-[9rem] -rotate-12" aria-hidden="true" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <i className="bi bi-receipt-cutoff text-[#9B2335] text-sm" aria-hidden="true" />
                    <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Resumen</span>
                  </div>

                  <div className="space-y-3 pb-6 border-b border-white/8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#C9BFB5]/70">Artículos</span>
                      <span className="text-[#F2EDE6] font-mono tabular-nums">{itemCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#C9BFB5]/70">Subtotal</span>
                      <span className="text-[#F2EDE6] font-mono tabular-nums">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between py-6">
                    <span className="text-[#F2EDE6] text-sm tracking-[0.15em] uppercase font-semibold">Total</span>
                    <span className="text-[#F7EA79] text-2xl md:text-3xl font-bold font-mono tracking-tight tabular-nums">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 w-full bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
                  >
                    <i className="bi bi-bag-check" aria-hidden="true" />
                    Finalizar compra
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-[#C9BFB5]/40 text-[11px] mt-4">
                    <i className="bi bi-shield-check" aria-hidden="true" />
                    Coordinamos el pago y la entrega al confirmar
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  )
}

export default Cart
