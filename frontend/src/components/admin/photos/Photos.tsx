import { useEffect, useRef, useState } from "react"
import usePhoto from "../../../hooks/usePhoto"
import Loader from "../../ui/Loader"

const Photos = () => {
  const { photos, getPhotos, createPhoto, deletePhoto, loading } = usePhoto()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [errorResponse, setErrorResponse] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getPhotos()
  }, [])

  const handleSelectFile = (file: File | null) => {
    setErrorResponse(null)
    setImageFile(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleUpload = async () => {
    if (!imageFile) {
      setErrorResponse("Elegí una imagen para subir.")
      return
    }
    try {
      setErrorResponse(null)
      const formData = new FormData()
      formData.append("image", imageFile)
      await createPhoto(formData)
      setImageFile(null)
      setPreview(null)
      if (inputRef.current) inputRef.current.value = ""
    } catch (error: any) {
      setErrorResponse(error.response?.data?.message ?? "No pudimos subir la foto. Intentá nuevamente.")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deletePhoto(id)
    } catch (error) {
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="w-full min-h-full bg-linear-to-br from-[#1C0A0E]/75 via-[#0F0507]/70 to-[#0A0A0A]/75 flex flex-col">

      <div className="px-6 py-7 md:px-10 md:py-9 border-b border-white/8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-images text-[#9B2335] text-xs" aria-hidden="true" />
            <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Carrusel</span>
          </div>
          <h2 className="text-white text-2xl md:text-4xl font-bold tracking-tight">Cargar fotos</h2>
          <p className="text-white/50 text-sm mt-2 max-w-md">Las fotos que subas se muestran en el carrusel de la página de inicio.</p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#9B2335]/30 bg-[#9B2335]/10 px-5 py-3 shrink-0">
          <i className="bi bi-images text-[#E0808C] text-xl" aria-hidden="true" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-white text-2xl md:text-3xl font-bold tabular-nums leading-none">{photos.length}</span>
            <span className="text-white/60 text-sm font-medium">fotos</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 md:p-10 flex flex-col gap-8">

        {/* Bloque de carga */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 md:p-8 flex flex-col gap-5">
          {errorResponse && (
            <div className="flex items-center gap-3 bg-[#9B2335]/10 border border-[#9B2335]/30 rounded-xl px-4 py-3">
              <i className="bi bi-exclamation-circle text-[#E0808C] text-lg shrink-0" aria-hidden="true" />
              <p className="text-[#E0808C] text-sm">{errorResponse}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Preview */}
            <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] flex items-center justify-center shrink-0">
              {preview ? (
                <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center px-4">
                  <i className="bi bi-image text-white/25 text-3xl" aria-hidden="true" />
                  <span className="text-white/35 text-xs font-mono">Vista previa</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/60 text-xs font-medium ml-1">Imagen</label>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSelectFile(e.target.files?.[0] ?? null)}
                  className="w-full text-white/60 text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#9B2335]/15 file:text-[#E0808C] hover:file:bg-[#9B2335]/25 file:cursor-pointer cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={loading.create || !imageFile}
                className="self-start flex items-center gap-2 bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-semibold tracking-wide px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="bi bi-upload text-base" aria-hidden="true" />
                {loading.create ? "Subiendo..." : "Subir foto"}
              </button>
            </div>
          </div>
        </div>

        {/* Grilla de fotos */}
        {loading.get ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 border border-dashed border-white/10 rounded-2xl">
            <i className="bi bi-images text-white/25 text-4xl" aria-hidden="true" />
            <p className="text-white/50 text-sm font-mono">Todavía no hay fotos en el carrusel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo._id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] aspect-video"
              >
                <img src={photo.image} alt="Foto del carrusel" className="h-full w-full object-cover" />

                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <button
                  type="button"
                  onClick={() => handleDelete(photo._id)}
                  disabled={deletingId === photo._id}
                  aria-label="Eliminar foto"
                  className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 text-white/80 hover:bg-[#9B2335] hover:text-white backdrop-blur-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === photo._id ? (
                    <i className="bi bi-arrow-repeat text-base animate-spin" aria-hidden="true" />
                  ) : (
                    <i className="bi bi-trash text-base" aria-hidden="true" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Photos
