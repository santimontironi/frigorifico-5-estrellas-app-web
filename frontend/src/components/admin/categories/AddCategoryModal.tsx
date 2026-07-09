import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCategorySchema } from "../../../../../shared/index.js"
import type { CreateCategoryCredentials } from "../../../types/category.types"
import useCategory from "../../../hooks/useCategory"

interface AddCategoryModalProps {
  open: boolean
  onClose: () => void
}

const AddCategoryModal = ({ open, onClose }: AddCategoryModalProps) => {

  const { createCategory, loading } = useCategory()

  const [errorResponse, setErrorResponse] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateCategoryCredentials>({
    resolver: zodResolver(createCategorySchema),
  })

  if (!open) return null

  async function onSubmit(data: CreateCategoryCredentials) {
    try {
      setErrorResponse(null)
      await createCategory(data)
      reset()
      onClose()
    } catch (error: any) {
      setErrorResponse(error.response?.data?.message ?? "No pudimos crear la categoría. Intentá nuevamente.")
    }
  }

  function handleClose() {
    setErrorResponse(null)
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
            <i className="bi bi-folder-plus text-white text-2xl" aria-hidden="true" />
          </div>
          <h2 className="text-[#1C1714] text-xl font-bold tracking-wide">
            Nueva categoría
          </h2>
          <p className="text-[#7A6B63] text-sm mt-2 leading-relaxed">
            Creá una categoría para organizar los productos del catálogo.
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
              <label className="text-[#7A6B63] text-xs font-medium ml-1">Nombre</label>
              <div className="relative">
                <i className="bi bi-collection absolute left-4 top-1/2 -translate-y-1/2 text-[#B8A898]" aria-hidden="true" />
                <input
                  type="text"
                  {...register("name")}
                  className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm pl-11 pr-4 py-3.5 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 placeholder:text-[#B8A898]/60"
                  placeholder="Ej: Carnes rojas"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {errors.name && (
                <span className="text-[#9B2335] text-xs ml-1">{errors.name.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading.create}
              className="w-full cursor-pointer bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-[0.12em] py-4 mt-1 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading.create ? "Creando..." : "Crear categoría"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCategoryModal
