import { useEffect, useState } from "react"
import useOffer from "../../../hooks/useOffer"
import OfferCard from "../../ui/OfferCard"
import Loader from "../../ui/Loader"
import AddOfferModal from "./AddOfferModal"

const AllOffers = () => {
  const { offers, getOffers, loading } = useOffer()

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    getOffers()
  }, [])

  return (

    <section className="w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col">

      <div className="px-6 py-7 md:px-10 md:py-9 border-b border-white/8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-fire text-[#9B2335] text-xs" aria-hidden="true" />
            <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Ofertas</span>
          </div>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">Todas las ofertas</h2>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-semibold tracking-wide px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <i className="bi bi-plus-lg text-base" aria-hidden="true" />
            Crear nueva oferta
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-[#9B2335]/30 bg-[#9B2335]/10 px-5 py-3">
            <i className="bi bi-fire text-[#E0808C] text-xl" aria-hidden="true" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-white text-2xl md:text-3xl font-bold tabular-nums leading-none">{offers.length}</span>
              <span className="text-white/60 text-sm font-medium">ofertas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10">
        {loading.get ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed border-white/10 rounded-2xl">
            <i className="bi bi-fire text-white/25 text-4xl" aria-hidden="true" />
            <p className="text-white/50 text-sm font-mono">No hay ofertas todavía</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {offers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} deletable cart={false} />
            ))}
          </div>
        )}
      </div>

      <AddOfferModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

export default AllOffers
