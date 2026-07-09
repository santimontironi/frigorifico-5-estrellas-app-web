import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProductSchema } from "../../../../shared/index.js"
import type { Product, UpdateProductInput, UpdateProductCredentials } from "../../types/product.types"
import UseProducts from "../../hooks/useProducts"
import useCategory from "../../hooks/useCategory"

interface EditProductModalProps {
  product: Product
  onClose: () => void
}

const EditProductModal = ({ product, onClose }: EditProductModalProps) => {

  const { editProduct, loading } = UseProducts()
  const { categories, getCategories, loading: categoriesLoading } = useCategory()

  const [errorResponse, setErrorResponse] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    getCategories()
  }, [])


  // 3 genéricos: entrada del form, contexto, salida ya validada (price como number)
  const { register, handleSubmit, formState: { errors } } = useForm<
    UpdateProductInput, any, UpdateProductCredentials
  >({
    // conecta zod con react-hook-form: valida al enviar y llena errors si falla
    resolver: zodResolver(updateProductSchema),
   
    defaultValues: {
      name: product.name,
      category: product.category._id,
      price: product.price,
      unit: product.unit,
    },
  })

  // data ya viene validada por el schema (price convertido a number)
  async function onSubmit(data: UpdateProductCredentials) {
    try {
      setErrorResponse(null)

      // FormData porque la imagen viaja como archivo; todo va como string y el back reconvierte price con coerce
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("category", data.category)
      formData.append("price", String(data.price))
      formData.append("unit", data.unit)
      if (imageFile) formData.append("image", imageFile)

      await editProduct(product._id, formData)
      onClose()
    } catch (error: any) {
      setErrorResponse(error.response?.data?.message ?? "No pudimos editar el producto. Intentá nuevamente.")
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
            <i className="bi bi-pencil-square text-white text-2xl" aria-hidden="true" />
          </div>
          <h2 className="text-[#1C1714] text-xl font-bold tracking-wide">
            Editar producto
          </h2>
          <p className="text-[#7A6B63] text-sm mt-2 leading-relaxed">
            Modificá los datos y, si querés, subí una imagen.
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
              <input
                type="text"
                {...register("name")}
                className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm px-4 py-3.5 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 placeholder:text-[#B8A898]/60"
                placeholder="Nombre del producto"
              />
              {errors.name && (
                <span className="text-[#9B2335] text-xs ml-1">{errors.name.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#7A6B63] text-xs font-medium ml-1">Categoría</label>
              <select
                {...register("category")}
                disabled={categoriesLoading.get}
                className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm px-4 py-3.5 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-[#9B2335] text-xs ml-1">{errors.category.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[#7A6B63] text-xs font-medium ml-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm px-4 py-3.5 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200"
                  placeholder="0"
                />
                {errors.price && (
                  <span className="text-[#9B2335] text-xs ml-1">{errors.price.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-[#7A6B63] text-xs font-medium ml-1">Unidad</label>
                <select
                  {...register("unit")}
                  className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm px-4 py-3.5 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 cursor-pointer"
                >
                  <option value="kg">kg</option>
                  <option value="unit">unidad</option>
                </select>
                {errors.unit && (
                  <span className="text-[#9B2335] text-xs ml-1">{errors.unit.message}</span>
                )}
              </div>
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
              disabled={loading.update}
              className="w-full cursor-pointer bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-[0.12em] py-4 mt-1 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading.update ? "Guardando..." : "Guardar cambios"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProductModal
