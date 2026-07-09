import { useEffect } from "react"
import UseAdmin from "../../hooks/UseAdmin"
import Loader from "../ui/Loader"
import CustomerCard from "./CustomerCard"

const Customers = () => {
  const { getCustomers, loading, customers } = UseAdmin()

  useEffect(() => {
    getCustomers()
  }, [])

  return (
    <section className="w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col">

      <div className="px-6 py-7 md:px-10 md:py-9 border-b border-white/8">
        <div className="flex items-center gap-2 mb-4">
          <i className="bi bi-person-lines-fill text-[#9B2335] text-xs" aria-hidden="true" />
          <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Clientes</span>
        </div>
        <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">Ver clientes</h2>
      </div>

      <div className="flex-1 p-6 md:p-10">
        {loading.customers ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed border-white/10 rounded-2xl">
            <i className="bi bi-person-x text-white/25 text-4xl" aria-hidden="true" />
            <p className="text-white/50 text-sm font-mono">No hay clientes todavía</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {customers.map((customer) => (
              <CustomerCard key={customer._id} customer={customer} />
            ))}
          </div>
        )}
      </div>

    </section>
  )
}

export default Customers
