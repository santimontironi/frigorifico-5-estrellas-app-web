interface FormSearchProps {
  value: string
  onChange: (value: string) => void
}

const FormSearch = ({ value, onChange }: FormSearchProps) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-xl">
      <i
        className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#C9BFB5]/50 text-sm pointer-events-none"
        aria-hidden="true"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar productos..."
        className="w-full bg-white/5 border border-white/10 rounded-full text-[#F2EDE6] text-sm placeholder:text-[#C9BFB5]/40 pl-11 pr-11 py-3 outline-none focus:border-[#9B2335]/60 focus:bg-white/8 focus:shadow-lg focus:shadow-[#9B2335]/10 transition-all duration-200"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9BFB5]/50 hover:text-[#F2EDE6] transition-colors duration-200 cursor-pointer"
        >
          <i className="bi bi-x-circle-fill text-sm" aria-hidden="true" />
        </button>
      )}
    </form>
  )
}

export default FormSearch
