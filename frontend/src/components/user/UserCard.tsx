interface UserCardProps {
  icon: string
  title: string
  description: string
  comingSoon?: boolean
}

const UserCard = ({ icon, title, description, comingSoon = false }: UserCardProps) => {

  if (comingSoon) {
    return (
      <div className="relative bg-[#121212] border border-dashed border-white/10 rounded-xl p-6 md:p-7 opacity-60">
        <div className="w-11 h-11 rounded-full bg-white/4 ring-1 ring-white/8 flex items-center justify-center mb-5">
          <i className={`${icon} text-white/30 text-lg`} aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h3 className="text-white/50 text-base md:text-lg font-bold tracking-tight">{title}</h3>
          <span className="text-[#F7EA79]/70 text-[10px] font-mono uppercase tracking-widest border border-[#F7EA79]/20 rounded-full px-2 py-0.5">
            Próximamente
          </span>
        </div>
        <p className="text-white/35 text-sm leading-relaxed">{description}</p>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden bg-[#121212] border border-white/8 rounded-xl p-6 md:p-7 transition-all duration-300 hover:border-[#F7EA79]/50 hover:bg-[#17150B] hover:-translate-y-0.5">
      <span className="absolute top-0 left-0 h-full w-0.5 bg-[#F7EA79] scale-y-0 origin-top transition-transform duration-300 group-hover:scale-y-100" aria-hidden="true" />
      <div className="w-11 h-11 rounded-full bg-[#F7EA79]/12 ring-1 ring-[#F7EA79]/25 flex items-center justify-center mb-5">
        <i className={`${icon} text-[#F7EA79] text-lg`} aria-hidden="true" />
      </div>
      <h3 className="text-white text-base md:text-lg font-bold tracking-tight mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

export default UserCard
