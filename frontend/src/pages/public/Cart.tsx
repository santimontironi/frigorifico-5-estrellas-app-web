import { Link } from 'react-router-dom'
import Header from '../../components/ui/Header'
import useAuth from '../../hooks/UseAuth'
import DiagonalLines from '../../components/ui/DiagonalLines'
import ProductInCart from '../../components/products/ProductInCart'
import useCart from '../../hooks/useCart'

const formatPrice = (value: number) => `$${value.toLocaleString('es-AR')}`

const Cart = () => {
  const { items, total, clearCart } = useCart()

  const { isUser } = useAuth()

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const isEmpty = items.length === 0

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
                {items.map((item) => (
                  <ProductInCart key={item.product._id} item={item} />
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
                    disabled={!isUser}
                    type="button"
                    className="flex items-center justify-center gap-2 w-full bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#872F31] disabled:hover:shadow-none disabled:active:scale-100"
                  >
                    <i className="bi bi-bag-check" aria-hidden="true" />
                    Finalizar compra
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-[#ffffff]/90 font-bold text-[11px] mt-4">
                    <i className={`bi ${isUser ? 'bi-shield-check' : 'bi-lock'}`} aria-hidden="true" />
                    {isUser
                      ? 'Coordinamos el pago y la entrega al confirmar'
                      : 'Iniciá sesión como cliente para finalizar tu compra'}
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
