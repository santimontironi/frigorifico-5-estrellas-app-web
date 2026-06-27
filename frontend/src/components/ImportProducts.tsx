import { useRef, useState } from 'react'
import api from '../services/api'

type ImportResult = {
  message: string
  inserted: number
  errors: string[]
}

const ImportProducts = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file?.name ?? null)
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const { data } = await api.post<ImportResult>('/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al importar')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFileName(null)
    setResult(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    // página admin completa — ocupa todo el área de contenido, coherente con SideNavAdmin
    <div className="w-full min-h-full bg-[#1C1714] flex flex-col">

      {/* encabezado de página — espeja el header del SideNavAdmin con borde inferior sutil */}
      <div className="px-8 py-8 border-b border-white/10">
        <h2 className="text-white text-2xl font-bold mb-1">Importar productos</h2>
        <p className="text-white/50 text-sm">
          El archivo Excel debe tener las columnas: <span className="text-white/80 font-mono">name, unit, category, price</span>
        </p>
      </div>

      {/* área de contenido principal — flex column con gap consistente */}
      <div className="flex-1 p-8 flex flex-col gap-6">

        {/* drop zone premium — borde sólido sutil, rounded-xl, glow carmesí en hover como punto focal */}
        <div
          className="border border-white/10 bg-white/[0.02] rounded-xl py-20 flex flex-col items-center gap-4 cursor-pointer hover:border-[#9B2335] hover:bg-[#9B2335]/5 hover:shadow-xl hover:shadow-[#9B2335]/10 transition-all duration-300"
          onClick={() => inputRef.current?.click()}
        >
          <i className="bi bi-file-earmark-spreadsheet text-6xl text-white/20" aria-hidden="true" />
          <p className="text-base text-white/60 text-center">
            {fileName ?? 'Seleccioná un archivo .xlsx para importar'}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* botones — CTA carmesí con shadow-glow como acción primaria, limpiar como borde blanco sutil */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!fileName || loading}
            className="px-8 py-3 bg-[#9B2335] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#9B2335]/25 hover:shadow-[#9B2335]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Importando...' : 'Importar'}
          </button>
          {fileName && (
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-white/10 text-white/50 text-sm rounded-xl hover:border-white/25 hover:text-white/80 transition-all duration-200"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* resultado éxito — borde izquierdo blanco neutro como indicador positivo */}
        {result && (
          <div className="border-l-2 border-white/30 bg-white/[0.03] rounded-r-xl p-5">
            <p className="text-white font-semibold text-sm">{result.message}</p>
            {result.errors.length > 0 && (
              <div className="mt-3">
                <p className="text-white/50 text-xs font-medium mb-1">Filas con errores:</p>
                <ul className="space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-white/40 text-xs font-mono">{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* resultado error — borde y fondo carmesí, texto blanco para contraste accesible */}
        {error && (
          <div className="border-l-2 border-[#9B2335] bg-[#9B2335]/10 rounded-r-xl p-5">
            <p className="text-white/80 text-sm">{error}</p>
          </div>
        )}

      </div>

    </div>
  )
}

export default ImportProducts
