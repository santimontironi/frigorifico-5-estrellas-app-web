import type { Product } from '../../types/product.types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { name, price, unit, category } = product
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#0F0507] border border-white/8 transition-all duration-300 hover:border-[#9B2335]/60 hover:shadow-[0_18px_50px_-18px_rgba(155,35,53,0.6)] hover:-translate-y-1.5">

      <div className="relative h-36 overflow-hidden bg-linear-to-br from-[#3A1119] via-[#1C0A0E] to-[#0A0A0A]">

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              -35deg,
              transparent,
              transparent 22px,
              rgba(155, 35, 53, 0.10) 22px,
              rgba(155, 35, 53, 0.10) 23px
            )`
          }}
        />

        <div className="absolute -inset-10 bg-[#9B2335]/0 group-hover:bg-[#9B2335]/12 blur-3xl transition-colors duration-500 pointer-events-none" />

        <i className="bi bi-star-fill absolute -bottom-4 -left-3 text-[#9B2335]/15 text-8xl -rotate-12 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />

        <span className="absolute top-3 left-4 z-10 text-[10px] tracking-[0.22em] uppercase font-mono text-[#C9BFB5]/80 border border-white/12 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
          por {unit === 'kg' ? 'kg' : 'unidad'}
        </span>

        <span className="absolute bottom-3 left-4 z-10 text-[#F2EDE6] text-[10px] tracking-[0.25em] uppercase font-mono flex items-center gap-1.5">
          <i className="bi bi-tag-fill text-[#9B2335]" aria-hidden="true" />
          {category.name}
        </span>

        <div className="absolute bottom-3 right-3 z-10 flex items-baseline gap-1 rounded-xl bg-[#F7EA79] px-3.5 py-2 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.7)] group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-300">
          <span className="text-[#1C0A0E] text-lg md:text-xl font-bold font-mono tracking-tight">
            ${price.toLocaleString('es-AR')}
          </span>
          <span className="text-[#1C0A0E]/55 text-[10px] font-mono uppercase">
            /{unit === 'kg' ? 'kg' : 'un'}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[#F2EDE6] text-lg font-bold tracking-tight leading-snug mb-5 group-hover:text-white transition-colors duration-200">
          {name}
        </h3>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="mt-auto flex items-center justify-center gap-2 w-full rounded-xl bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide py-3 cursor-pointer transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
        >
          <i className="bi bi-cart-plus text-base transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}

export default ProductCard
