import type { Product } from "../../../types/product.types"

interface Props {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

const ProductAdminCard = ({ product, onEdit, onDelete }: Props) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-[#0F0507] border border-white/8 transition-all duration-300 hover:border-[#9B2335]/60">
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

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide py-3 cursor-pointer transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
          >
            <i className="bi bi-pencil-square text-base" aria-hidden="true" />
            Editar
          </button>

          <button
            type="button"
            onClick={() => onDelete(product)}
            aria-label={`Eliminar ${product.name}`}
            className="flex items-center justify-center shrink-0 w-12 rounded-xl border border-white/10 bg-white/5 text-[#C9BFB5]/70 text-base py-3 cursor-pointer transition-all duration-200 hover:border-[#9B2335]/60 hover:bg-[#9B2335]/15 hover:text-[#E0808C] active:scale-[0.98]"
          >
            <i className="bi bi-trash3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductAdminCard
