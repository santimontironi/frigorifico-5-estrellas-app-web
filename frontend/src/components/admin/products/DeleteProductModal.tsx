import { useState } from "react"
import type { Product } from "../../../types/product.types"
import UseProducts from "../../../hooks/useProducts"

interface DeleteProductModalProps {
  product: Product
  onClose: () => void
}

const DeleteProductModal = ({ product, onClose }: DeleteProductModalProps) => {

  const { deleteProduct, loading } = UseProducts()

  const [errorResponse, setErrorResponse] = useState<string | null>(null)

  async function onConfirm() {
    try {
      setErrorResponse(null)
      await deleteProduct(product._id)
      onClose()
    } catch (error: any) {
      setErrorResponse(error.response?.data?.message ?? "No pudimos eliminar el producto. Intentá nuevamente.")
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-6 py-10"
      role="dialog"
      aria-modal="true"
    >

      <div
        className="absolute inset-0 bg-[#0F0507]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden animate-[fadeIn_0.2s_ease-out]">

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-[#7A6B63] hover:bg-[#F7F4F1] hover:text-[#9B2335] transition-colors duration-200 cursor-pointer"
        >
          <i className="bi bi-x-lg text-base" aria-hidden="true" />
        </button>

        <div className="px-8 pt-10 pb-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-[#9B2335] to-[#4A0E18] flex items-center justify-center mb-5 shadow-lg">
            <i className="bi bi-trash3 text-white text-2xl" aria-hidden="true" />
          </div>
          <h2 className="text-[#1C1714] text-xl font-bold tracking-wide">
            Eliminar producto
          </h2>
          <p className="text-[#7A6B63] text-sm mt-2 leading-relaxed">
            Vas a eliminar <span className="text-[#1C1714] font-semibold">{product.name}</span>. Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="mx-8 h-px bg-linear-to-r from-transparent via-[#E8DFD6] to-transparent" />

        <div className="px-8 pt-6 pb-10 flex flex-col gap-5">

          {errorResponse && (
            <div className="flex items-center gap-3 bg-[#9B2335]/5 rounded-xl px-4 py-3">
              <i className="bi bi-exclamation-circle text-[#9B2335] text-lg shrink-0" aria-hidden="true" />
              <p className="text-[#9B2335] text-sm">{errorResponse}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading.delete}
              className="flex-1 cursor-pointer bg-[#F7F4F1] text-[#7A6B63] text-sm font-bold tracking-[0.12em] py-4 rounded-xl hover:bg-[#EFE9E3] hover:text-[#1C1714] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading.delete}
              className="flex-1 cursor-pointer bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-[0.12em] py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading.delete ? "Eliminando..." : "Eliminar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DeleteProductModal
