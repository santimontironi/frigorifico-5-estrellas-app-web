interface InfoCardProps {
  icon: string
  title: string
  description: string
  comingSoon?: boolean
  onClick?: () => void
}

const InfoCard = ({ icon, title, description, onClick }: InfoCardProps) => {

  // Sin onClick la tarjeta es solo informativa (ej: página "Sobre nosotros"):
  // se renderiza como div estático, sin hover ni flecha, para no parecer clickeable.
  if (!onClick) {
    return (
      <div className="relative overflow-hidden bg-[#121212] border border-white/8 rounded-xl p-6 md:p-7">
        <div className="w-11 h-11 rounded-full bg-[#9B2335]/12 ring-1 ring-[#9B2335]/25 flex items-center justify-center mb-5">
          <i className={`${icon} text-[#9B2335] text-lg`} aria-hidden="true" />
        </div>
        <h3 className="text-white text-base md:text-lg font-bold tracking-tight mb-2">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden bg-[#121212] border border-white/8 rounded-xl p-6 md:p-7 w-full text-left cursor-pointer transition-all duration-300 hover:border-[#9B2335]/50 hover:bg-[#1B1417] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B2335]/60"
    >
      <span className="absolute top-0 left-0 h-full w-0.5 bg-[#9B2335] scale-y-0 origin-top transition-transform duration-300 group-hover:scale-y-100" aria-hidden="true" />
      <div className="w-11 h-11 rounded-full bg-[#9B2335]/12 ring-1 ring-[#9B2335]/25 flex items-center justify-center mb-5">
        <i className={`${icon} text-[#9B2335] text-lg`} aria-hidden="true" />
      </div>
      <h3 className="text-white text-base md:text-lg font-bold tracking-tight mb-2 flex items-center gap-2">
        <span>{title}</span>
        <i className="bi bi-arrow-right text-[#9B2335] text-sm ml-auto shrink-0 opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" aria-hidden="true" />
      </h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </button>
  )
}

export default InfoCard
