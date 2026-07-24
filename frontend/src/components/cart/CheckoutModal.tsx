import { useState } from "react"
import { Link } from "react-router-dom"
import useCart from "../../hooks/useCart"
import useOrder from "../../hooks/useOrder"

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
}

const CheckoutModal = ({ open, onClose }: CheckoutModalProps) => {
  const { items, clearCart } = useCart()
  const { createOrder, loading } = useOrder()

  const [notes, setNotes] = useState("")
  const [errorResponse, setErrorResponse] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  async function handleConfirm() {
    try {
      setErrorResponse(null)

      // Del carrito solo enviamos id y cantidad: el back arma los snapshots
      // de precio y toma la dirección de entrega del usuario autenticado.
      const orderItems = items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }))

      await createOrder({ items: orderItems, notesUser: notes.trim() || undefined })

      clearCart()
      setSuccess(true)
    } catch (error: any) {
      setErrorResponse(error.response?.data?.message ?? "No pudimos crear el pedido. Intentá nuevamente.")
    }
  }

  function handleClose() {
    setErrorResponse(null)
    setSuccess(false)
    setNotes("")
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
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-[#7A6B63] hover:bg-[#F7F4F1] hover:text-[#9B2335] transition-colors duration-200 cursor-pointer z-10"
        >
          <i className="bi bi-x-lg text-base" aria-hidden="true" />
        </button>

        {success ? (
          <div className="px-8 pt-12 pb-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-[#2E7D32] to-[#1B5E20] flex items-center justify-center mb-5 shadow-lg">
              <i className="bi bi-check-lg text-white text-3xl" aria-hidden="true" />
            </div>
            <h2 className="text-[#1C1714] text-xl font-bold tracking-wide">
              ¡Pedido confirmado!
            </h2>
            <p className="text-[#7A6B63] text-sm mt-2 leading-relaxed">
              Recibimos tu pedido. Vamos a coordinar el pago y la entrega a la brevedad.
            </p>

            <div className="flex flex-col gap-3 mt-8">
              <Link
                to="/panel-usuario"
                onClick={handleClose}
                className="w-full bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-[0.12em] py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200"
              >
                Ver mis pedidos
              </Link>
              <button
                type="button"
                onClick={handleClose}
                className="w-full text-[#7A6B63] text-sm font-medium py-2 hover:text-[#9B2335] transition-colors duration-200 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="px-8 pt-10 pb-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-[#9B2335] to-[#4A0E18] flex items-center justify-center mb-5 shadow-lg">
                <i className="bi bi-bag-check text-white text-2xl" aria-hidden="true" />
              </div>
              <h2 className="text-[#1C1714] text-xl font-bold tracking-wide">
                Confirmar pedido
              </h2>
              <p className="text-[#7A6B63] text-sm mt-2 leading-relaxed">
                Lo enviamos a la dirección registrada en tu cuenta. Podés dejar una nota para la entrega.
              </p>
            </div>

            <div className="mx-8 h-px bg-linear-to-r from-transparent via-[#E8DFD6] to-transparent" />

            <div className="px-8 pt-6 pb-10">

              <div className="flex items-start gap-3 bg-[#9B2335]/5 rounded-xl px-4 py-3 mb-5">
                <i className="bi bi-info-circle text-[#9B2335] text-base shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[#7A6B63] text-xs leading-relaxed">
                  Si te mudaste o cambiaste de dirección, actualizá tus datos en <span className="font-semibold text-[#1C1714]">Mi perfil</span> antes de confirmar el pedido.
                </p>
              </div>

              {errorResponse && (
                <div className="flex items-center gap-3 bg-[#9B2335]/5 rounded-xl px-4 py-3 mb-5">
                  <i className="bi bi-exclamation-circle text-[#9B2335] text-lg shrink-0" aria-hidden="true" />
                  <p className="text-[#9B2335] text-sm">{errorResponse}</p>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[#7A6B63] text-xs font-medium ml-1">Notas <span className="text-[#B8A898]">(opcional)</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm px-4 py-3.5 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 placeholder:text-[#B8A898]/60 resize-none"
                  placeholder="Ej: tocar timbre, entregar por la tarde..."
                />
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading.create}
                className="w-full cursor-pointer bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-[0.12em] py-4 mt-6 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading.create ? "Confirmando..." : "Confirmar pedido"}
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CheckoutModal
