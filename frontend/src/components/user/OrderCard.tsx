import { useState } from "react"
import type { Order } from "../../types/order.types"
import useOrder from "../../hooks/useOrder"

const formatPrice = (value: number) => `$${value.toLocaleString('es-AR')}`

const unitLabel = (unit: string) => (unit === 'kg' ? 'kg' : 'un')

// Config visual por estado: etiqueta, ícono y colores del badge.
const STATUS_CONFIG = {
  pending:        { label: 'Pendiente',      icon: 'bi-hourglass-split', className: 'text-[#F7EA79] bg-[#F7EA79]/10 border-[#F7EA79]/30' },
  rejected:       { label: 'Rechazado',      icon: 'bi-x-circle',        className: 'text-[#C9405A] bg-[#9B2335]/10 border-[#9B2335]/40' },
  paid:           { label: 'Pagado',         icon: 'bi-credit-card',     className: 'text-[#5CD68A] bg-[#5CD68A]/10 border-[#5CD68A]/30' },
  in_preparation: { label: 'En preparación', icon: 'bi-box-seam',        className: 'text-[#F0A868] bg-[#F0A868]/10 border-[#F0A868]/30' },
  delivered:      { label: 'Entregado',      icon: 'bi-bag-check',       className: 'text-[#0F2915] bg-[#5CD68A] border-[#5CD68A]' },
  canceled:       { label: 'Cancelado',      icon: 'bi-slash-circle',    className: 'text-white/50 bg-white/5 border-white/15' },
}

interface OrderCardProps {
  order: Order
}

const OrderCard = ({ order }: OrderCardProps) => {
  const { cancelOrder, payOrder, loading } = useOrder()

  const [confirming, setConfirming] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const status = STATUS_CONFIG[order.status]

  // Solo se puede cancelar mientras está pendiente (misma regla que el back).
  const isCancelable = order.status === 'pending'

  // Cuando el pedido pasa a preparación, el cliente puede pagarlo.
  const isPayable = order.status === 'in_preparation'

  const handleCancel = async () => {
    try {
      setErrorMessage(null)
      await cancelOrder(order._id)
      // Si sale bien, el pedido se quita de la lista desde el context.
    } catch (error: any) {
      setConfirming(false)
      setErrorMessage(error.response?.data?.message ?? "No pudimos cancelar el pedido. Intentá nuevamente.")
    }
  }

  const handlePay = async () => {
    try {
      setErrorMessage(null)
      const initPoint = await payOrder(order._id)
      // Redirigimos al checkout de Mercado Pago.
      window.location.href = initPoint
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message ?? "No pudimos iniciar el pago. Intentá nuevamente.")
    }
  }

  const date = new Date(order.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  // Los últimos 6 caracteres del _id como referencia legible del pedido.
  const shortId = order._id.slice(-6).toUpperCase()

  // Si el frigorífico ya confirmó el peso, mostramos el total final; si no, el aproximado.
  const hasFinal = order.finalAmount !== null
  const total = hasFinal ? order.finalAmount! : order.approximateTotal

  return (
    <div className="bg-[#121212] border border-[#F7EA79]/15 rounded-xl p-6 md:p-7 shadow-lg shadow-[#F7EA79]/5 transition-colors duration-300 hover:border-[#F7EA79]/30">

      <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/8">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <i className="bi bi-receipt text-[#F7EA79] text-sm" aria-hidden="true" />
            <span className="text-white text-sm font-mono font-semibold tracking-wide">Pedido #{shortId}</span>
          </div>
          <p className="text-white/40 text-xs mt-1.5">{date}</p>
        </div>

        <span className={`flex items-center gap-1.5 shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border ${status.className}`}>
          <i className={`bi ${status.icon}`} aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <ul className="divide-y divide-white/5 py-2">
        {order.items.map((item) => (
          <li key={item._id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="text-[#F2EDE6] text-sm font-medium truncate">{item.nameSnapshot}</p>
              <p className="text-white/40 text-xs font-mono mt-0.5">
                {item.quantity} {unitLabel(item.unitSnapshot)} · {formatPrice(item.priceSnapshot)}
              </p>
            </div>
            <span className="text-[#F2EDE6] text-sm font-mono font-semibold tabular-nums shrink-0">
              {formatPrice(item.subtotal)}
            </span>
          </li>
        ))}
      </ul>

      {order.status === 'rejected' && order.rejectionReason && (
        <div className="flex items-start gap-2.5 bg-[#9B2335]/10 border border-[#9B2335]/25 rounded-lg px-4 py-3 mt-3">
          <i className="bi bi-exclamation-triangle text-[#C9405A] text-sm shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-white/70 text-xs leading-relaxed">
            <span className="text-[#C9405A] font-semibold">Motivo del rechazo:</span> {order.rejectionReason}
          </p>
        </div>
      )}

      {order.notesUser && (
        <div className="flex items-start gap-2.5 mt-3">
          <i className="bi bi-chat-left-text text-white/30 text-sm shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-white/50 text-xs leading-relaxed">{order.notesUser}</p>
        </div>
      )}

      <div className="flex items-baseline justify-between pt-5 mt-4 border-t border-white/8">
        <span className="text-white/60 text-xs uppercase tracking-[0.15em] font-medium">
          {hasFinal ? 'Total final' : 'Total aproximado'}
        </span>
        <span className="text-[#F7EA79] text-xl md:text-2xl font-bold font-mono tracking-tight tabular-nums">
          {formatPrice(total)}
        </span>
      </div>

      {!hasFinal && (
        <p className="text-white/30 text-[11px] mt-2 text-right">
          Los cortes por kilo se pesan al preparar el pedido. El monto final lo confirma el frigorífico.
        </p>
      )}

      {order.status === 'paid' && (
        <div className="flex items-start gap-2.5 bg-[#5CD68A]/8 border border-[#5CD68A]/25 rounded-lg px-4 py-3 mt-4">
          <i className="bi bi-check-circle text-[#5CD68A] text-sm shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-white/70 text-xs leading-relaxed">
            Pago confirmado. Estamos coordinando la entrega de tu pedido.
          </p>
        </div>
      )}

      {order.status === 'delivered' && (
        <div className="flex items-start gap-2.5 bg-[#5CD68A]/8 border border-[#5CD68A]/25 rounded-lg px-4 py-3 mt-4">
          <i className="bi bi-bag-check text-[#5CD68A] text-sm shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-white/70 text-xs leading-relaxed">
            Pedido entregado. ¡Gracias por elegirnos!
          </p>
        </div>
      )}

      {isPayable && (
        <div className="pt-5 mt-4 border-t border-white/8">
          {errorMessage && (
            <div className="flex items-start gap-2.5 bg-[#9B2335]/10 border border-[#9B2335]/25 rounded-lg px-4 py-3 mb-4">
              <i className="bi bi-exclamation-circle text-[#C9405A] text-sm shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-white/70 text-xs leading-relaxed">{errorMessage}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handlePay}
            disabled={loading.pay}
            className="flex items-center justify-center gap-2 w-full bg-[#2E7D32] text-[#F2EDE6] text-sm font-semibold tracking-wide px-5 py-3 rounded-xl transition-all duration-200 hover:bg-[#388E3C] hover:shadow-[0_0_24px_-4px_rgba(46,125,50,0.7)] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <i className="bi bi-credit-card" aria-hidden="true" />
            {loading.pay ? "Redirigiendo..." : "Comprar"}
          </button>
        </div>
      )}

      {isCancelable && (
        <div className="pt-5 mt-4 border-t border-white/8">
          {errorMessage && (
            <div className="flex items-start gap-2.5 bg-[#9B2335]/10 border border-[#9B2335]/25 rounded-lg px-4 py-3 mb-4">
              <i className="bi bi-exclamation-circle text-[#C9405A] text-sm shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-white/70 text-xs leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {confirming ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-white/60 text-xs flex-1">¿Seguro que querés cancelar este pedido?</p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={loading.cancel}
                  className="text-white/60 text-xs font-medium px-4 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading.cancel}
                  className="flex items-center gap-1.5 bg-[#9B2335]/15 border border-[#9B2335]/40 text-[#C9405A] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#9B2335]/25 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <i className="bi bi-slash-circle" aria-hidden="true" />
                  {loading.cancel ? "Cancelando..." : "Sí, cancelar"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex items-center justify-center gap-2 w-full bg-[#9B2335] text-[#F2EDE6] text-sm font-semibold tracking-wide px-5 py-3 rounded-xl transition-all duration-200 hover:bg-[#B82A40] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98] cursor-pointer"
            >
              <i className="bi bi-slash-circle" aria-hidden="true" />
              Cancelar pedido
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderCard
