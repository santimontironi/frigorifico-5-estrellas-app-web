import Swal from "sweetalert2"
import type { Offer } from "../../types/offer.types"
import useOffer from "../../hooks/useOffer"
import useCart from "../../hooks/useCart"

interface OfferCardProps {
  offer: Offer
  deletable?: boolean
  cart?: boolean
}

const OfferCard = ({ offer, deletable = false, cart = false }: OfferCardProps) => {
  const { deleteOffer } = useOffer()

  const { product, newPrice, image } = offer

  const { addToCart } = useCart()

  const oldPrice = product.price

  const discount = oldPrice > 0 ? Math.round((1 - newPrice / oldPrice) * 100) : 0
  const unitLabel = product.unit === "kg" ? "kg" : "unidad"

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Eliminar oferta",
      html: `Vas a eliminar la oferta de <strong>${product.name}</strong>.<br/>Esta acción la ocultará del catálogo.`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: "#8B1A2F",
      cancelButtonColor: "#8A8078",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#F5F0E8",
      color: "#1A1416",
      iconColor: "#9B2335",
      backdrop: "rgba(15, 5, 7, 0.55)",
      width: 420,
      padding: "2rem 1.5rem",
    })

    if (result.isConfirmed) {
      await deleteOffer(offer._id)
    }
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#0F0507] border border-white/8 transition-all duration-300 hover:border-[#9B2335]/60 hover:shadow-[0_28px_70px_-24px_rgba(155,35,53,0.65)] hover:-translate-y-1.5">

      {deletable && (
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Eliminar oferta de ${product.name}`}
          title="Eliminar oferta"
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0F0507]/70 text-white/70 backdrop-blur-sm hover:text-[#F2EDE6] hover:bg-[#9B2335]/85 hover:border-[#9B2335] cursor-pointer transition-all duration-300"
        >
          <i className="bi bi-trash3 text-base" aria-hidden="true" />
        </button>


      )}

      <div className="relative h-60 overflow-hidden bg-linear-to-br from-[#3A1119] via-[#1C0A0E] to-[#0A0A0A]">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
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
                )`,
              }}
            />
            <div className="absolute -inset-10 bg-[#9B2335]/0 group-hover:bg-[#9B2335]/12 blur-3xl transition-colors duration-500 pointer-events-none" />
            <i className="bi bi-fire absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#9B2335]/25 text-8xl group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#0F0507] to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="text-[#F2EDE6] text-xl md:text-2xl font-bold tracking-tight leading-snug group-hover:text-white transition-colors duration-200">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#9B2335] to-[#7A1C2A] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-lg">
            <i className="bi bi-fire" aria-hidden="true" />
            Oferta
          </span>
          {discount > 0 && (
            <span className="rounded-full bg-[#F7EA79] px-3 py-1.5 text-[11px] xl:text-[15px] font-bold tracking-wide text-[#1C0A0E] shadow-lg">
              -{discount}%
            </span>
          )}
        </div>

        <div className="mt-auto pt-6">
          <span className="block text-[#C9BFB5]/45 text-sm font-mono line-through">
            ${oldPrice.toLocaleString("es-AR")}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#F7EA79] text-3xl md:text-4xl font-bold font-mono tracking-tight">
              ${newPrice.toLocaleString("es-AR")}
            </span>
            <span className="text-[#F7EA79]/75 text-xs font-mono font-bold uppercase">
              /{unitLabel}
            </span>
          </div>
        </div>

        {cart && (
          <button
            type="button"
            onClick={() => addToCart({...product, price: newPrice}, 1)}
            className="mt-6 flex items-center justify-center gap-2 w-full rounded-xl bg-[#872F31] text-[#F2EDE6] text-sm md:text-base font-semibold tracking-wide py-3.5 cursor-pointer transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_28px_-4px_rgba(155,35,53,0.75)] active:scale-[0.98]"
          >
            <i className="bi bi-cart-plus text-lg transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
            Agregar al carrito
          </button>
        )}
      </div>
    </article>
  )
}

export default OfferCard
