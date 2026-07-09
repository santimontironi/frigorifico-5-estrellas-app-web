import { useEffect, useState } from "react"
import UseProducts from "../../../hooks/useProducts"
import Loader from "../../ui/Loader"
import EditProductModal from "./EditProductModal"
import type { Product } from "../../../types/product.types"

const ProductsAdmin = () => {
  const { products, getProducts, loading } = UseProducts()

  const [editing, setEditing] = useState<Product | null>(null)

  useEffect(() => {
    getProducts()
  }, [])

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

        <span className="shrink-0 text-white/50 text-sm font-mono">
          {products.length} productos
        </span>
      </div>

      <div className="flex-1 p-6 md:p-10">
        {loading.get ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed border-white/10 rounded-2xl">
            <i className="bi bi-inbox text-white/25 text-4xl" aria-hidden="true" />
            <p className="text-white/50 text-sm font-mono">No hay productos todavía</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <article
                key={product._id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-[#0F0507] border border-white/8 transition-all duration-300 hover:border-[#9B2335]/60"
              >
                <div className="relative h-36 overflow-hidden bg-linear-to-br from-[#3A1119] via-[#1C0A0E] to-[#0A0A0A]">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="bi bi-image text-white/15 text-4xl" aria-hidden="true" />
                    </div>
                  )}

                  <span className="absolute top-3 left-4 z-10 text-[10px] tracking-[0.22em] uppercase font-mono text-[#C9BFB5]/80 border border-white/12 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {product.category.name}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[#F2EDE6] text-lg font-bold tracking-tight leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-[#C9BFB5]/70 text-sm font-mono mt-1">
                    ${product.price.toLocaleString("es-AR")}
                    <span className="text-[#C9BFB5]/40"> / {product.unit === "kg" ? "kg" : "un"}</span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setEditing(product)}
                    className="mt-5 flex items-center justify-center gap-2 w-full rounded-xl bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide py-3 cursor-pointer transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
                  >
                    <i className="bi bi-pencil-square text-base" aria-hidden="true" />
                    Editar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EditProductModal product={editing} onClose={() => setEditing(null)} />
      )}
    </section>
  )
}

export default ProductsAdmin
