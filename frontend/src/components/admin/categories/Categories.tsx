import { useEffect, useState } from "react"
import useCategory from "../../../hooks/useCategory"
import CategoryCard from "../../category/CategoryCard"
import Loader from "../../ui/Loader"
import AddCategoryModal from "./AddCategoryModal"

const Categories = () => {
  const { categories, getCategories, loading } = useCategory()

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    getCategories()
  }, [])

  return (
    // wrapper de vista admin — mismo chrome que ImportProducts/WelcomeAdmin: gradiente carmín→negro, full-bleed
    <section className="w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col">

      {/* header de sección — kicker + título, separado del contenido por border-b (patrón consistente del panel) */}
      <div className="px-6 py-7 md:px-10 md:py-9 border-b border-white/8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-collection text-[#9B2335] text-xs" aria-hidden="true" />
            <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Categorías</span>
          </div>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">Todas las categorías</h2>
        </div>

        {/* acciones de sección — botón de crear + contador */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-semibold tracking-wide px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <i className="bi bi-folder-plus text-base" aria-hidden="true" />
            Crear nueva categoría
          </button>
          {/* badge de total — número grande + label, más visible que el contador mono */}
          <div className="flex items-center gap-3 rounded-xl border border-[#9B2335]/30 bg-[#9B2335]/10 px-5 py-3">
            <i className="bi bi-collection text-[#E0808C] text-xl" aria-hidden="true" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-white text-2xl md:text-3xl font-bold tabular-nums leading-none">{categories.length}</span>
              <span className="text-white/60 text-sm font-medium">categorías</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10">
        {loading.get ? (
          // loader centrado mientras se traen las categorías (mismo patrón que Home)
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : categories.length === 0 ? (
          // estado vacío — borde punteado discreto, sin ruido visual
          <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed border-white/10 rounded-2xl">
            <i className="bi bi-inbox text-white/25 text-4xl" aria-hidden="true" />
            <p className="text-white/50 text-sm font-mono">No hay categorías todavía</p>
          </div>
        ) : (
          // grid responsive mobile-first: 1 col base, 2 en md, 3 en xl
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                id={category._id}
                name={category.name}
              />
            ))}
          </div>
        )}
      </div>

      <AddCategoryModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

export default Categories
