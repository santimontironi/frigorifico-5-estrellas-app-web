interface UserCardProps {
  icon: string
  title: string
  description: string
  onClick?: () => void
}

const UserCard = ({ icon, title, description, onClick }: UserCardProps) => {

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden bg-[#121212] border border-white/8 rounded-xl p-6 md:p-7 w-full text-left cursor-pointer transition-all duration-300 hover:border-[#F7EA79]/50 hover:bg-[#17150B] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7EA79]/60"
    >
      <span className="absolute top-0 left-0 h-full w-0.5 bg-[#F7EA79] scale-y-0 origin-top transition-transform duration-300 group-hover:scale-y-100" aria-hidden="true" />
      <div className="w-11 h-11 rounded-full bg-[#F7EA79]/12 ring-1 ring-[#F7EA79]/25 flex items-center justify-center mb-5">
        <i className={`${icon} text-[#F7EA79] text-lg`} aria-hidden="true" />
      </div>
      <h3 className="text-white text-base md:text-lg font-bold tracking-tight mb-2 flex items-center gap-2">
        <span>{title}</span>
        <i className="bi bi-arrow-right text-[#F7EA79] text-sm ml-auto shrink-0 opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" aria-hidden="true" />
      </h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </button>
  )
}

export default UserCard
