import { useEffect, useState } from "react"
import UseProducts from "../../../hooks/useProducts"
import Loader from "../../ui/Loader"
import EditProductModal from "./EditProductModal"
import AddProductModal from "./AddProductModal"
import ProductAdminCard from "./ProductAdminCard"
import type { Product } from "../../../types/product.types"
import FormSearch from "../../ui/FormSearch"

const ProductsAdmin = () => {
  const { products, getProducts, loading, searchProducts, productsFiltered } = UseProducts()

  const [editing, setEditing] = useState<Product | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [query, setQuery] = useState<string>('')

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => { //se pone en un useEffect porque puede que se busque algo mientras se cargan los productos o se modifique el array de productos
    searchProducts(query)
  }, [query, products])

  const isSearching = query.trim().length > 0
  const productsToShow = isSearching ? productsFiltered : products

  return (

    <section className="w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col">

      <div className="px-6 py-7 md:px-10 md:py-9 border-b border-white/8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-box-seam text-[#9B2335] text-xs" aria-hidden="true" />
            <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Productos</span>
          </div>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">Todos los productos</h2>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl border border-[#9B2335]/30 bg-[#9B2335]/10 px-5 py-3">
            <i className="bi bi-box-seam text-[#E0808C] text-xl" aria-hidden="true" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-white text-2xl md:text-3xl font-bold tabular-nums leading-none">{products.length}</span>
              <span className="text-white/60 text-sm font-medium">productos</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-wide px-5 py-3.5 shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <i className="bi bi-plus-lg text-base" aria-hidden="true" />
            Agregar producto
          </button>
        </div>
      </div>

      <div className="px-6 py-5 md:px-10 md:py-6 border-b border-white/8 flex items-center gap-4">
        <FormSearch value={query} onChange={setQuery} />
        {isSearching && (
          <span className="shrink-0 text-white/50 text-sm font-mono">
            {productsToShow.length} resultado{productsToShow.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div className="flex-1 p-6 md:p-10">
        {loading.get ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : productsToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed border-white/10 rounded-2xl">
            <i className="bi bi-inbox text-white/25 text-4xl" aria-hidden="true" />
            <p className="text-white/50 text-sm font-mono">
              {isSearching ? `No se encontraron productos para "${query}"` : 'No hay productos todavía'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {productsToShow.map((product) => (
              <ProductAdminCard
                key={product._id}
                product={product}
                onEdit={setEditing}
              />
            ))}
          </div>
        )}
      </div>

      {addOpen && (
        <AddProductModal onClose={() => setAddOpen(false)} />
      )}

      {editing && (
        <EditProductModal product={editing} onClose={() => setEditing(null)} />
      )}
    </section>
  )
}

export default ProductsAdmin
