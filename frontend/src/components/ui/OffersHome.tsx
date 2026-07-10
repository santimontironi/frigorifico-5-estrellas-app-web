import { useEffect } from "react"
import useOffer from "../../hooks/useOffer"
import OfferCard from "./OfferCard"

const OffersHome = () => {
  const { offers, getOffers, loading } = useOffer()

  useEffect(() => {
    getOffers()
  }, [])

  // Mientras carga por primera vez no mostramos nada, para no dejar un hueco vacío.
  // Si no hay ofertas activas, la sección directamente no aparece en el Home.
  if (loading.get || offers.length === 0) return null

  return (
    <section className="relative overflow-hidden border-b border-white/8 bg-linear-to-br from-[#150A0D] via-[#0F0507] to-[#0A0A0A]">

      <div className="absolute top-0 right-1/4 w-75 h-75 md:w-120 md:h-120 rounded-full bg-[#9B2335]/12 blur-[130px] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:px-10 md:py-16">

        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-3">
            <i className="bi bi-fire text-[#9B2335] text-sm" aria-hidden="true" />
            <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Ofertas</span>
          </div>
          <h2 className="text-[#F2EDE6] text-2xl md:text-3xl font-bold tracking-tight">
            Aprovechá los <span className="text-[#C9405A] [text-shadow:0_0_28px_rgba(155,35,53,0.6)]">descuentos</span>
          </h2>
          <p className="text-[#C9BFB5]/60 text-sm md:text-base mt-3 max-w-xl leading-relaxed">
            Cortes seleccionados a precio rebajado por tiempo limitado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {offers.map((offer) => (
            <OfferCard key={offer._id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default OffersHome
