import { useEffect, useState } from "react"
import UseAdmin from "../../../hooks/UseAdmin"
import OrderCardAdmin from "./OrderCardAdmin"
import Loader from "../../ui/Loader"

const STATUS_FILTERS = [
  { value: '',               label: 'Todos',          icon: 'bi-grid' },
  { value: 'pending',        label: 'Pendientes',     icon: 'bi-hourglass-split' },
  { value: 'in_preparation', label: 'En preparación', icon: 'bi-box-seam' },
  { value: 'paid',           label: 'Pagados',        icon: 'bi-credit-card' },
  { value: 'delivered',      label: 'Entregados',     icon: 'bi-bag-check' },
  { value: 'rejected',       label: 'Rechazados',     icon: 'bi-x-circle' },
]

const AllOrders = () => {
  const { orders, ordersFiltered, getAllOrders, getOrdersByStatus, loading } = UseAdmin()

  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    // Fetch inicial + polling cada 10s para ver los pedidos nuevos y sus cambios de estado.
    getAllOrders()

    const interval = setInterval(() => {
      getAllOrders()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Re-aplica el filtro cada vez que cambian los pedidos (polling) o el estado elegido,
  // así ordersFiltered nunca queda desactualizado respecto de orders.
  useEffect(() => {
    getOrdersByStatus(selectedStatus)
  }, [orders, selectedStatus])

  // Spinner solo en la carga inicial; los refrescos del polling no parpadean.
  const isInitialLoading = loading.orders && orders.length === 0

  return (
    <section className="w-full min-h-full bg-linear-to-br from-[#1C0A0E]/75 via-[#0F0507]/70 to-[#0A0A0A]/75 flex flex-col">

      <div className="px-6 py-7 md:px-10 md:py-9 border-b border-white/8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-bag-check text-[#9B2335] text-xs" aria-hidden="true" />
            <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Pedidos</span>
          </div>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">Todos los pedidos</h2>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#9B2335]/30 bg-[#9B2335]/10 px-5 py-3 shrink-0">
          <i className="bi bi-bag-check text-[#E0808C] text-xl" aria-hidden="true" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-white text-2xl md:text-3xl font-bold tabular-nums leading-none">{ordersFiltered.length}</span>
            <span className="text-white/60 text-sm font-medium">pedidos</span>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 md:px-10 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setSelectedStatus(filter.value)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all duration-200 cursor-pointer ${selectedStatus === filter.value
              ? "bg-[#9B2335] border-[#9B2335] text-white"
              : "border-white/15 text-[#C9BFB5] hover:border-[#9B2335]/60"
              }`}
          >
            <i className={`bi ${filter.icon}`} aria-hidden="true" />
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 md:p-10">
        {isInitialLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : ordersFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed border-white/10 rounded-2xl">
            <i className="bi bi-bag-x text-white/25 text-4xl" aria-hidden="true" />
            <p className="text-white/50 text-sm font-mono">
              {selectedStatus ? 'No hay pedidos con este estado' : 'No hay pedidos todavía'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8 max-w-8xl">
            {ordersFiltered.map((order) => (
              <OrderCardAdmin key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AllOrders
