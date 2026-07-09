import { useState } from 'react'
import UseProducts from '../../hooks/useProducts'
import type { ImportProductsResponse } from '../../types/product.types'
import DiagonalLines from '../ui/DiagonalLines'

const ImportProducts = () => {
  const { importProducts, loading } = UseProducts()

  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<ImportProductsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!file) return

    setResult(null)
    setError(null)

    try {
      const res = await importProducts(file)
      setResult(res)
    } catch (err: any) {
      const arrayErrors: string[] = err.response?.data?.message
      setError(arrayErrors[0])
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col relative overflow-hidden">

      <DiagonalLines />

      <div className="relative z-10 px-6 py-7 md:px-10 md:py-9 border-b border-white/8">
        <div className="flex items-center gap-2 mb-4">
          <i className="bi bi-table text-[#9B2335] text-xs" aria-hidden="true" />
          <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Gestión de catálogo</span>
        </div>
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 tracking-tight">Importar productos</h2>
        <p className="text-white/70 text-sm">Cargá productos en masa desde un archivo Excel estructurado.</p>
      </div>

      <div className="relative z-10 flex-1 p-6 md:p-10 flex flex-col gap-8">

        <div>
          <div className="flex items-center gap-2 mb-3">
            <i className="bi bi-info-circle text-[#9B2335] text-sm" aria-hidden="true" />
            <span className="text-white/70 text-xs uppercase tracking-[0.18em] font-medium">Formato esperado del archivo</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#9B2335]/25 bg-white/2">
            <table className="w-full min-w-90 text-xs font-mono">
              <thead>
                <tr className="bg-[#9B2335]/15 border-b border-[#9B2335]/30">
                  <th className="text-white text-left px-4 py-3 font-medium tracking-wide">name</th>
                  <th className="text-white text-left px-4 py-3 font-medium tracking-wide">unit</th>
                  <th className="text-white text-left px-4 py-3 font-medium tracking-wide">category</th>
                  <th className="text-white text-left px-4 py-3 font-medium tracking-wide">price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="text-white/60 px-4 py-2.5">Bife de chorizo</td>
                  <td className="text-white/60 px-4 py-2.5">kg</td>
                  <td className="text-white/60 px-4 py-2.5">Vacuno</td>
                  <td className="text-white/60 px-4 py-2.5">9200</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="text-white/60 px-4 py-2.5">Vacío</td>
                  <td className="text-white/60 px-4 py-2.5">kg</td>
                  <td className="text-white/60 px-4 py-2.5">Vacuno</td>
                  <td className="text-white/60 px-4 py-2.5">8700</td>
                </tr>
                <tr>
                  <td className="text-white/60 px-4 py-2.5">Pollo entero</td>
                  <td className="text-white/60 px-4 py-2.5">kg</td>
                  <td className="text-white/60 px-4 py-2.5">Aves</td>
                  <td className="text-white/60 px-4 py-2.5">3100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <label
          className={`border-2 border-dashed rounded-2xl py-16 md:py-24 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 ${
            file
              ? 'border-[#9B2335]/70 bg-[#9B2335]/8 shadow-[0_0_40px_rgba(155,35,53,0.15)]'
              : 'border-white/10 bg-white/1 hover:border-[#872F31]/60 hover:bg-[#872F31]/5 hover:shadow-[0_0_40px_rgba(135,47,49,0.12)]'
          }`}
        >
          <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
            file
              ? 'bg-[#9B2335]/20 ring-1 ring-[#9B2335]/50'
              : 'bg-white/3 ring-1 ring-white/6'
          }`}>
            <i
              className={`bi bi-file-earmark-spreadsheet text-5xl md:text-6xl ${file ? 'text-[#C9405A]' : 'text-white/30'}`}
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className={`text-sm md:text-base text-center max-w-xs ${file ? 'text-white font-medium' : 'text-white/60'}`}>
              {file?.name ?? 'Arrastrá tu archivo .xlsx o hacé clic para buscarlo'}
            </p>
            <p className="text-white/40 text-xs text-center">Formatos soportados: .xlsx · .xls</p>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <div className="flex gap-3 items-center">
          <button
            onClick={handleSubmit}
            disabled={!file || loading.import}
            className="flex items-center gap-2 px-8 py-3 bg-[#872F31] text-white text-sm font-semibold tracking-wide rounded hover:bg-[#9B2335] hover:shadow-[0_0_24px_rgba(155,35,53,0.45)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
          >
            <i className="bi bi-upload" aria-hidden="true" />
            {loading.import ? 'Importando...' : 'Importar'}
          </button>
          {file && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 cursor-pointer border border-white/12 text-white/70 text-sm rounded hover:border-[#9B2335]/70 hover:text-white hover:bg-[#9B2335]/10 transition-all duration-200"
            >
              <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
              Limpiar
            </button>
          )}
        </div>

        {result && (
          <div className="border-l-4 border-[#9B2335] bg-[#9B2335]/10 rounded-r-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <i className="bi bi-check-circle-fill text-[#9B2335] text-lg mt-0.5 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-white font-semibold text-sm md:text-base">{result.message}</p>
                {result.errors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/15">
                    <p className="text-white/50 text-xs uppercase tracking-widest font-medium mb-3">Filas con errores:</p>
                    <ul className="space-y-2">
                      {result.errors.map((e, i) => (
                        <li key={i} className="text-white/70 text-xs font-mono pl-3 border-l border-[#9B2335]/40 py-0.5">{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="border-l-4 border-[#872F31] bg-[#872F31]/12 rounded-r-xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <i className="bi bi-exclamation-triangle-fill text-[#872F31] text-lg mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-white text-sm md:text-base">{error}</p>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}

export default ImportProducts
