import { useState } from "react"
import type { OrderAdmin } from "../../../types/order.types"
import UseAdmin from "../../../hooks/UseAdmin"

const formatPrice = (value: number) => `$${value.toLocaleString('es-AR')}`

const unitLabel = (unit: string) => (unit === 'kg' ? 'kg' : 'un')

const whatsappUrl = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  const withCountry = digits.startsWith('54') ? digits : `54${digits}`
  return `https://wa.me/${withCountry}`
}

// Config visual por estado: etiqueta, ícono y colores del badge.
const STATUS_CONFIG = {
  pending:        { label: 'Pendiente',      icon: 'bi-hourglass-split', className: 'text-[#F7EA79] bg-[#F7EA79]/10 border-[#F7EA79]/30' },
  rejected:       { label: 'Rechazado',      icon: 'bi-x-circle',        className: 'text-[#C9405A] bg-[#9B2335]/10 border-[#9B2335]/40' },
  paid:           { label: 'Pagado',         icon: 'bi-credit-card',     className: 'text-[#5CD68A] bg-[#5CD68A]/10 border-[#5CD68A]/30' },
  in_preparation: { label: 'En preparación', icon: 'bi-box-seam',        className: 'text-[#F0A868] bg-[#F0A868]/10 border-[#F0A868]/30' },
  delivered:      { label: 'Entregado',      icon: 'bi-bag-check',       className: 'text-[#0F2915] bg-[#5CD68A] border-[#5CD68A]' },
  canceled:       { label: 'Cancelado',      icon: 'bi-slash-circle',    className: 'text-white/50 bg-white/5 border-white/15' },
}

interface OrderCardAdminProps {
  order: OrderAdmin
}

const OrderCardAdmin = ({ order }: OrderCardAdminProps) => {
  const { updateOrderStatus, loading } = UseAdmin()

  const [finalAmount, setFinalAmount] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const statusConfig = STATUS_CONFIG[order.status]

  const date = new Date(order.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const shortId = order._id.slice(-6).toUpperCase()

  const hasFinal = order.finalAmount !== null
  const total = hasFinal ? order.finalAmount! : order.approximateTotal

  // Acciones disponibles según el estado del pedido.
  const isPending = order.status === 'pending'
  // Solo se entrega un pedido ya pagado: el estado "paid" lo pone Mercado Pago.
  const canDeliver = order.status === 'paid'
  const isWaitingPayment = order.status === 'in_preparation'
  const hasActions = isPending || canDeliver || isWaitingPayment

  const handlePreparation = async () => {
    try {
      setErrorMessage(null)
      await updateOrderStatus(order._id, {
        status: 'in_preparation',
        finalAmount: finalAmount.trim() ? Number(finalAmount) : undefined,
      })
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message ?? "No pudimos actualizar el pedido. Intentá nuevamente.")
    }
  }

  const handleReject = async () => {
    try {
      setErrorMessage(null)
      await updateOrderStatus(order._id, { status: 'rejected', rejectionReason })
      setRejecting(false)
      setRejectionReason('')
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message ?? "No pudimos actualizar el pedido. Intentá nuevamente.")
    }
  }

  const handleDelivered = async () => {
    try {
      setErrorMessage(null)
      await updateOrderStatus(order._id, { status: 'delivered' })
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message ?? "No pudimos actualizar el pedido. Intentá nuevamente.")
    }
  }

  const { user, deliveryAddress: address } = order
  const addressLine = [
    `${address.street} ${address.number}`,
    address.floor ? `Piso ${address.floor}` : null,
    address.apartment ? `Depto ${address.apartment}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="bg-[#160C0F] border border-[#9B2335]/90 rounded-2xl p-5 sm:p-6 md:p-7 shadow-[0_10px_35px_-12px_rgba(0,0,0,0.9)] transition-colors duration-300 hover:border-[#9B2335]/60">

      <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <i className="bi bi-receipt text-[#9B2335] text-sm" aria-hidden="true" />
            <span className="text-white text-sm font-mono font-semibold tracking-wide">Pedido #{shortId}</span>
          </div>
          <p className="text-white/40 text-xs mt-1.5">{date}</p>
        </div>

        <span className={`flex items-center gap-1.5 shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusConfig.className}`}>
          <i className={`bi ${statusConfig.icon}`} aria-hidden="true" />
          {statusConfig.label}
        </span>
      </div>

      <div className="flex flex-col gap-3 my-4 rounded-xl border border-[#9B2335]/30 bg-[#9B2335]/10 px-4 sm:px-5 py-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#9B2335]/20">
          <i className="bi bi-person-fill text-[#E0808C] text-xl shrink-0" aria-hidden="true" />
          <span className="text-white text-lg md:text-xl font-bold tracking-tight truncate">{user.firstName} {user.lastName}</span>
        </div>
        <div className="flex flex-col gap-2.5 text-[#F2EDE6]/90 text-sm font-medium">
          <span className="flex items-start gap-2 min-w-0">
            <i className="bi bi-envelope text-[#9B2335] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="min-w-0 break-all">{user.email}</span>
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2">
              <i className="bi bi-telephone text-[#9B2335] shrink-0" aria-hidden="true" />{user.phone}
            </span>
            <a
              href={whatsappUrl(user.phone)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Escribir a ${user.firstName} por WhatsApp`}
              className="flex items-center gap-1.5 bg-[#177d3c] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-[#20BD5A] active:scale-[0.97]"
            >
              <i className="bi bi-whatsapp text-sm" aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-1">
          <i className="bi bi-box-seam text-[#9B2335] text-xs" aria-hidden="true" />
          <span className="text-white/45 text-[11px] uppercase tracking-[0.15em] font-semibold">Productos</span>
        </div>
        <ul className="divide-y divide-white/8">
          {order.items.map((item) => (
            <li key={item._id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-[#F2EDE6] text-base font-semibold truncate">{item.nameSnapshot}</p>
                <p className="text-white/45 text-xs font-mono mt-0.5">
                  {item.quantity} {unitLabel(item.unitSnapshot)} · {formatPrice(item.priceSnapshot)}
                </p>
              </div>
              <span className="text-[#F2EDE6] text-base font-mono font-bold tabular-nums shrink-0">
                {formatPrice(item.subtotal)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-1.5">
          <i className="bi bi-geo-alt-fill text-[#9B2335] text-xs" aria-hidden="true" />
          <span className="text-white/45 text-[11px] uppercase tracking-[0.15em] font-semibold">Entrega</span>
        </div>
        <p className="text-[#F2EDE6]/90 text-sm md:text-base font-medium leading-relaxed pl-0.5">
          {addressLine} — {address.city}, {address.province}
        </p>
      </div>

      {order.notesUser && (
        <div className="flex items-start gap-2.5 mt-3 rounded-lg border border-white/10 bg-white/3 px-3.5 py-3">
          <i className="bi bi-chat-left-text text-white/60 text-sm shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-white/80 text-xs font-medium leading-relaxed">{order.notesUser}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mt-4 rounded-xl border border-[#F7EA79]/25 bg-[#F7EA79]/8 px-4 sm:px-5 py-3.5">
        <span className="text-[#F7EA79]/80 text-xs uppercase tracking-[0.15em] font-semibold">
          {hasFinal ? 'Total final' : 'Total aproximado'}
        </span>
        <span className="text-[#F7EA79] text-xl md:text-2xl font-bold font-mono tracking-tight tabular-nums shrink-0">
          {formatPrice(total)}
        </span>
      </div>

      {hasActions && (
        <div className="pt-5 mt-4 border-t border-white/8">
          {errorMessage && (
            <div className="flex items-start gap-2.5 bg-[#9B2335]/10 border border-[#9B2335]/25 rounded-lg px-4 py-3 mb-4">
              <i className="bi bi-exclamation-circle text-[#C9405A] text-sm shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-white/70 text-xs leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {isPending && !rejecting && (
            <div className="flex flex-col gap-3">
              <label className="text-white text-xs font-bold">
                Monto final 
              </label>
              <input
                type="number"
                step="0.01"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                placeholder="Ingrese el monto final"
                className="w-full bg-[#0A0A0A] border border-white/75 rounded-xl text-[#F2EDE6] text-sm px-4 py-3 outline-none focus:border-white transition-colors duration-200 placeholder:text-white/75"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handlePreparation}
                  disabled={loading.updateOrder}
                  className="flex items-center justify-center gap-2 flex-1 bg-[#F0A868] text-[#1C0A0E] text-sm font-bold tracking-wide px-5 py-3 rounded-xl transition-all duration-200 hover:bg-[#F3B87E] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <i className="bi bi-box-seam" aria-hidden="true" />
                  Poner en preparación
                </button>
                <button
                  type="button"
                  onClick={() => setRejecting(true)}
                  disabled={loading.updateOrder}
                  className="flex items-center justify-center gap-2 bg-[#9B2335] text-[#F2EDE6] text-sm font-semibold tracking-wide px-5 py-3 rounded-xl transition-all duration-200 hover:bg-[#B82A40] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <i className="bi bi-x-circle" aria-hidden="true" />
                  Rechazar
                </button>
              </div>
            </div>
          )}

          {isPending && rejecting && (
            <div className="flex flex-col gap-3">
              <label className="text-white/50 text-xs font-medium">Motivo del rechazo</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={2}
                placeholder="Ej: sin stock del corte solicitado..."
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl text-[#F2EDE6] text-sm px-4 py-3 outline-none focus:border-[#9B2335]/50 transition-colors duration-200 placeholder:text-white/25 resize-none"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setRejecting(false); setRejectionReason('') }}
                  disabled={loading.updateOrder}
                  className="text-white/60 text-sm font-medium px-4 py-3 rounded-xl hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={loading.updateOrder}
                  className="flex items-center justify-center gap-2 flex-1 bg-[#9B2335] text-[#F2EDE6] text-sm font-bold tracking-wide px-5 py-3 rounded-xl transition-all duration-200 hover:bg-[#B82A40] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <i className="bi bi-x-circle" aria-hidden="true" />
                  {loading.updateOrder ? "Rechazando..." : "Confirmar rechazo"}
                </button>
              </div>
            </div>
          )}

          {isWaitingPayment && (
            <div className="flex items-start gap-2.5 rounded-lg border border-[#F0A868]/25 bg-[#F0A868]/8 px-4 py-3">
              <i className="bi bi-hourglass-split text-[#F0A868] text-sm shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-white/70 text-xs leading-relaxed">
                Esperando el pago del cliente. Cuando lo pague vas a poder marcarlo como entregado.
              </p>
            </div>
          )}

          {canDeliver && (
            <button
              type="button"
              onClick={handleDelivered}
              disabled={loading.updateOrder}
              className="flex items-center justify-center gap-2 w-full bg-[#2E7D32] text-[#F2EDE6] text-sm font-bold tracking-wide px-5 py-3 rounded-xl transition-all duration-200 hover:bg-[#388E3C] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="bi bi-bag-check" aria-hidden="true" />
              {loading.updateOrder ? "Actualizando..." : "Marcar como entregado"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderCardAdmin
