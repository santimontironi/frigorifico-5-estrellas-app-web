import { useEffect } from "react"
import useCategory from "../../hooks/useCategory"
import CategoryCard from "../category/CategoryCard"
import Loader from "../ui/Loader"

const Categories = () => {
  const { categories, getCategories, loading } = useCategory()

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

        {/* contador — mismo patrón que el contador de productos en Home */}
        <span className="shrink-0 text-white/50 text-sm font-mono">
          {categories.length} categorías
        </span>
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
                name={category.name}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Categories
