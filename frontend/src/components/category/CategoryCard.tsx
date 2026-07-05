interface CategoryCardProps {
  name: string
}

const CategoryCard = ({ name }: CategoryCardProps) => {
  return (
    <article className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-linear-to-br from-[#150A0D] to-[#0F0507] border border-white/8 p-5 transition-all duration-300 hover:border-[#9B2335]/60 hover:shadow-[0_18px_44px_-18px_rgba(155,35,53,0.55)] hover:-translate-y-1">

      {/* trama diagonal sutil de fondo — mismo motivo que ProductCard */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: `repeating-linear-gradient(
            -35deg,
            transparent,
            transparent 20px,
            rgba(155, 35, 53, 0.055) 20px,
            rgba(155, 35, 53, 0.055) 21px
          )`
        }}
        aria-hidden="true"
      />

      {/* glow carmín que aparece en hover */}
      <div className="absolute -inset-16 bg-[#9B2335]/0 group-hover:bg-[#9B2335]/10 blur-3xl transition-colors duration-500 pointer-events-none" aria-hidden="true" />

      {/* ícono fantasma decorativo en la esquina */}
      <i className="bi bi-tag-fill absolute -right-3 -bottom-4 text-[#9B2335]/8 text-7xl rotate-12 group-hover:scale-110 group-hover:text-[#9B2335]/12 transition-all duration-500 pointer-events-none" aria-hidden="true" />

      {/* línea "corte" superior que crece en hover */}
      <span className="absolute top-0 left-0 h-px w-0 bg-[#9B2335] transition-[width] duration-300 group-hover:w-full" aria-hidden="true" />

      {/* badge del ícono */}
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#9B2335]/12 border border-[#9B2335]/25 group-hover:bg-[#9B2335]/22 group-hover:border-[#9B2335]/40 transition-colors duration-300">
        <i className="bi bi-tag-fill text-[#9B2335] text-lg group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
      </div>

      {/* texto — kicker mono + nombre */}
      <div className="relative z-10 min-w-0 flex-1">
        <span className="block text-[#C9BFB5]/45 text-[10px] font-mono uppercase tracking-[0.22em] mb-1">
          Categoría
        </span>
        <h3 className="text-[#F2EDE6] text-lg font-bold tracking-tight leading-snug truncate group-hover:text-white transition-colors duration-200">
          {name}
        </h3>
      </div>

      {/* chevron que se desliza en hover */}
      <i className="bi bi-chevron-right relative z-10 shrink-0 text-white/20 text-sm -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[#9B2335] transition-all duration-300" aria-hidden="true" />
    </article>
  )
}

export default CategoryCard
