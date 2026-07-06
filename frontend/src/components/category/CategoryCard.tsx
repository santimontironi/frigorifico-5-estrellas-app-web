import Swal from 'sweetalert2'
import useCategory from '../../hooks/useCategory'

interface CategoryCardProps {
  id: string
  name: string
}

const CategoryCard = ({ id, name }: CategoryCardProps) => {
  const { deleteCategory } = useCategory()

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Eliminar categoría',
      html: `Vas a eliminar la categoría <strong>${name}</strong>.<br/>Esta acción la ocultará del catálogo.`,
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: '#8B1A2F',
      cancelButtonColor: '#8A8078',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#F5F0E8',
      color: '#1A1416',
      iconColor: '#9B2335',
      backdrop: 'rgba(15, 5, 7, 0.55)',
      width: 420,
      padding: '2rem 1.5rem',
    })

    if (result.isConfirmed) {
      await deleteCategory(id)
    }
  }

  return (
    <article className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-linear-to-br from-[#150A0D] to-[#0F0507] border border-white/50 p-5 transition-all duration-300 hover:border-[#9B2335]/60 hover:shadow-[0_18px_44px_-18px_rgba(155,35,53,0.55)] hover:-translate-y-1">

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

      <div className="absolute -inset-16 bg-[#9B2335]/0 group-hover:bg-[#9B2335]/10 blur-3xl transition-colors duration-500 pointer-events-none" aria-hidden="true" />

      <i className="bi bi-tag-fill absolute -right-3 -bottom-4 text-[#9B2335]/8 text-7xl rotate-12 group-hover:scale-110 group-hover:text-[#9B2335]/12 transition-all duration-500 pointer-events-none" aria-hidden="true" />

      <span className="absolute top-0 left-0 h-px w-0 bg-[#9B2335] transition-[width] duration-300 group-hover:w-full" aria-hidden="true" />

      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#9B2335]/12 border border-[#9B2335]/25 group-hover:bg-[#9B2335]/22 group-hover:border-[#9B2335]/40 transition-colors duration-300">
        <i className="bi bi-tag-fill text-[#9B2335] text-lg group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <span className="block text-[#C9BFB5]/45 text-[10px] font-mono uppercase tracking-[0.22em] mb-1">
          Categoría
        </span>
        <h3 className="text-[#F2EDE6] text-lg font-bold tracking-tight leading-snug truncate group-hover:text-white transition-colors duration-200">
          {name}
        </h3>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        aria-label={`Eliminar categoría ${name}`}
        title="Eliminar categoría"
        className="relative z-10 shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/35 hover:text-[#F2EDE6] hover:bg-[#9B2335]/85 hover:border-[#9B2335] cursor-pointer transition-all duration-300"
      >
        <i className="bi bi-trash3 text-base" aria-hidden="true" />
      </button>
    </article>
  )
}

export default CategoryCard
