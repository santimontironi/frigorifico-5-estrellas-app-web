import { useEffect } from "react"
import { Link } from "react-router-dom"
import GoldDiagonalLines from "../ui/GoldDiagonalLines"
import OrderCard from "./OrderCard"
import useOrder from "../../hooks/useOrder"

const MyOrders = () => {
  const { orders, loading, getOrders } = useOrder()

  useEffect(() => {
    // Fetch inicial + polling: refrescamos los pedidos cada 15s para reflejar
    // los cambios de estado que hace el admin (aceptado, rechazado, etc.).
    getOrders()

    const interval = setInterval(() => {
      getOrders()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Spinner solo en la carga inicial (sin pedidos aún). En los refrescos del
  // polling ya hay lista en pantalla, así que se actualiza sin parpadear.
  const isInitialLoading = loading.get && orders.length === 0
  const isEmpty = !loading.get && orders.length === 0

  return (
    <div className="w-full min-h-full bg-linear-to-br from-[#1C1608] via-[#0F0C05] to-[#0A0A0A] flex flex-col relative overflow-hidden">

      <GoldDiagonalLines />

      <div className="relative z-10 px-6 py-7 md:px-10 md:py-9 border-b border-white/8">
        <div className="flex items-center gap-2 mb-4">
          <i className="bi bi-bag-check text-[#F7EA79] text-xs" aria-hidden="true" />
          <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Mis pedidos</span>
        </div>
        <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
          Tus pedidos
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-2xl mt-2">
          Seguí el estado de cada pedido: pendiente, aceptado, en preparación y entregado.
        </p>
      </div>

      <div className="relative z-10 flex-1 p-6 md:p-10">

        {isInitialLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#F7EA79] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isEmpty ? (
          <div className="bg-[#121212] border border-[#F7EA79]/15 rounded-xl px-6 py-16 text-center flex flex-col items-center">
            <span className="flex items-center justify-center w-16 h-16 rounded-full border border-[#F7EA79]/30 bg-[#F7EA79]/10 mb-6">
              <i className="bi bi-bag-x text-[#F7EA79] text-2xl" aria-hidden="true" />
            </span>
            <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-3">
              Todavía no tenés pedidos
            </h2>
            <p className="text-white/50 text-sm md:text-base max-w-md mb-8 leading-relaxed">
              Explorá el catálogo, armá tu carrito y confirmá tu primer pedido. Acá vas a poder seguir su estado.
            </p>
            <Link
              to="/"
              className="flex items-center gap-2 bg-[#F7EA79]/15 border border-[#F7EA79]/30 text-[#F7EA79] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#F7EA79]/25 active:scale-[0.98]"
            >
              <i className="bi bi-shop" aria-hidden="true" />
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-3xl">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default MyOrders
