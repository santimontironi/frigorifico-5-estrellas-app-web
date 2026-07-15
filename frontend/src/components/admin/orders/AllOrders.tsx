import { useEffect } from "react"
import UseAdmin from "../../../hooks/UseAdmin"
import OrderCardAdmin from "./OrderCardAdmin"
import Loader from "../../ui/Loader"

const AllOrders = () => {
  const { orders, getAllOrders, loading } = UseAdmin()

  useEffect(() => {
    // Fetch inicial + polling cada 15s para ver los pedidos nuevos y sus cambios de estado.
    getAllOrders()

    const interval = setInterval(() => {
      getAllOrders()
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  // Spinner solo en la carga inicial; los refrescos del polling no parpadean.
  const isInitialLoading = loading.orders && orders.length === 0

  return (
    <section className="w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col">

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
            <span className="text-white text-2xl md:text-3xl font-bold tabular-nums leading-none">{orders.length}</span>
            <span className="text-white/60 text-sm font-medium">pedidos</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10">
        {isInitialLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed border-white/10 rounded-2xl">
            <i className="bi bi-bag-x text-white/25 text-4xl" aria-hidden="true" />
            <p className="text-white/50 text-sm font-mono">No hay pedidos todavía</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
            {orders.map((order) => (
              <OrderCardAdmin key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AllOrders
