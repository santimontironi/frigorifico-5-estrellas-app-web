import type { Product } from '../../types/product.types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { name, price, unit, category, image } = product
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#0F0507] border border-white/8 transition-all duration-300 hover:border-[#9B2335]/60 hover:shadow-[0_18px_50px_-18px_rgba(155,35,53,0.6)] hover:-translate-y-1.5">

      <div className="relative h-44 overflow-hidden bg-linear-to-br from-[#3A1119] via-[#1C0A0E] to-[#0A0A0A]">

        {image ? (
          // si el producto tiene imagen se muestra la foto limpia, sin nada encima que la tape
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // sin imagen: se mantiene el fondo decorativo (rayas + brillo + estrella)
          <>
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
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">

        {/* categoría — ahora fuera de la imagen, arriba del contenido */}
        <span className="inline-flex items-center gap-1.5 self-start text-[10px] tracking-[0.22em] uppercase font-mono text-[#C9BFB5]/70 mb-2.5">
          <i className="bi bi-tag-fill text-[#9B2335]" aria-hidden="true" />
          {category.name}
        </span>

        <h3 className="text-[#F2EDE6] text-lg font-bold tracking-tight leading-snug group-hover:text-white transition-colors duration-200">
          {name}
        </h3>

        {/* precio + botón anclados abajo para que las cards queden alineadas */}
        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="text-[#F7EA79] text-2xl font-bold font-mono tracking-tight">
              ${price.toLocaleString('es-AR')}
            </span>
            <span className="text-[#F7EA79]/75 text-xs font-mono font-bold uppercase">
              /{unit === 'kg' ? 'kg' : 'unidad'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide py-3 cursor-pointer transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
          >
            <i className="bi bi-cart-plus text-base transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
