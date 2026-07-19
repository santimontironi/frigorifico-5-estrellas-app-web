import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createOfferSchema } from "../../../../../shared/index.js"
import type { CreateOfferInput, CreateOfferCredentials } from "../../../types/offer.types"
import useOffer from "../../../hooks/useOffer"
import UseProducts from "../../../hooks/useProducts"

interface AddOfferModalProps {
  open: boolean
  onClose: () => void
}
const formatPrice = (value: number) => `$${value.toLocaleString('es-AR')}`
const AddOfferModal = ({ open, onClose }: AddOfferModalProps) => {

  const { createOffer, loading } = useOffer()
  const { products, getProducts, loading: productsLoading } = UseProducts()

  const [errorResponse, setErrorResponse] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (open) getProducts()
  }, [open])

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<
    CreateOfferInput, any, CreateOfferCredentials
  >({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      product: "",
      newPrice: undefined,
    },
  })
  const selectedProductId = watch("product")
  const selectedProduct = products.find((p) => p._id === selectedProductId)

  if (!open) return null

  async function onSubmit(data: CreateOfferCredentials) {
    try {
      setErrorResponse(null)

      const formData = new FormData()
      formData.append("product", data.product)
      formData.append("newPrice", String(data.newPrice))
      if (imageFile) formData.append("image", imageFile)

      await createOffer(formData)
      reset()
      setImageFile(null)
      onClose()
    } catch (error: any) {
      setErrorResponse(error.response?.data?.message ?? "No pudimos crear la oferta. Intentá nuevamente.")
    }
  }

  function handleClose() {
    setErrorResponse(null)
    setImageFile(null)
    reset()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-6 py-10"
      role="dialog"
      aria-modal="true"
    >

      <div
        className="absolute inset-0 bg-[#0F0507]/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden animate-[fadeIn_0.2s_ease-out]">

        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-[#7A6B63] hover:bg-[#F7F4F1] hover:text-[#9B2335] transition-colors duration-200 cursor-pointer"
        >
          <i className="bi bi-x-lg text-base" aria-hidden="true" />
        </button>

        <div className="px-8 pt-10 pb-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-[#9B2335] to-[#4A0E18] flex items-center justify-center mb-5 shadow-lg">
            <i className="bi bi-fire text-white text-2xl" aria-hidden="true" />
          </div>
          <h2 className="text-[#1C1714] text-xl font-bold tracking-wide">
            Nueva oferta
          </h2>
          <p className="text-[#7A6B63] text-sm mt-2 leading-relaxed">
            Elegí un producto y ponele un precio rebajado. La imagen es opcional.
          </p>
        </div>

        <div className="mx-8 h-px bg-linear-to-r from-transparent via-[#E8DFD6] to-transparent" />

        <div className="px-8 pt-6 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {errorResponse && (
              <div className="flex items-center gap-3 bg-[#9B2335]/5 rounded-xl px-4 py-3">
                <i className="bi bi-exclamation-circle text-[#9B2335] text-lg shrink-0" aria-hidden="true" />
                <p className="text-[#9B2335] text-sm">{errorResponse}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[#7A6B63] text-xs font-medium ml-1">Producto</label>
              <select
                {...register("product")}
                disabled={productsLoading.get}
                className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm px-4 py-3.5 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 cursor-pointer"
              >
                <option value="" disabled>Elegí un producto</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.product && (
                <span className="text-[#9B2335] text-xs ml-1">{errors.product.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              {selectedProduct && (
                <span className="text-[#7A6B63] text-xs ml-1">
                  Precio actual: {formatPrice(selectedProduct.price)}
                </span>
              )}
              <label className="text-[#7A6B63] text-xs font-medium ml-1">Precio de oferta</label>
              <input
                type="number"
                step="0.01"
                {...register("newPrice")}
                className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm px-4 py-3.5 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 placeholder:text-[#B8A898]/60"
                placeholder="0"
              />

              {errors.newPrice && (
                <span className="text-[#9B2335] text-xs ml-1">{errors.newPrice.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#7A6B63] text-xs font-medium ml-1">Imagen (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-[#7A6B63] text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#9B2335]/10 file:text-[#9B2335] hover:file:bg-[#9B2335]/15 file:cursor-pointer cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading.create}
              className="w-full cursor-pointer bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-[0.12em] py-4 mt-1 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading.create ? "Creando..." : "Crear oferta"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AddOfferModal
