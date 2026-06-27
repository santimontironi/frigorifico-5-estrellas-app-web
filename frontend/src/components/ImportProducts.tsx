import { useState } from 'react'
import { importProductsService } from '../services/product.service'
import type { ImportProductsResponse } from '../types/products.types'

const ImportProducts = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportProductsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await importProductsService(file)
      setResult(res.data)
    } catch (err: any) {
      const arrayErrors: string[] = err.response?.data?.message
      setError(arrayErrors[0])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (

    <div className="w-full min-h-full bg-[#010101] flex flex-col">

      <div className="px-8 py-8 border-b border-white/10">
        <h2 className="text-white text-2xl font-bold mb-1">Importar productos</h2>
        <p className="text-white/50 text-sm">
          El archivo Excel debe tener las columnas: <span className="text-[#CFAE68] font-mono">name, unit, category, price</span>
        </p>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-6">

        <label
          className={`border border-dashed ${file ? 'border-[#CFAE68]/60 bg-[#CFAE68]/4' : 'border-[#CFAE68]/30 bg-[#CFAE68]/2'} rounded-xl py-20 flex flex-col items-center gap-4 cursor-pointer hover:border-[#872F31] hover:bg-[#872F31]/5 hover:shadow-[0_0_24px_rgba(135,47,49,0.12)] transition-all duration-300`}
        >
          <i className={`bi bi-file-earmark-spreadsheet text-6xl ${file ? 'text-[#CFAE68]' : 'text-[#CFAE68]/30'}`} aria-hidden="true" />
          <p className={`text-base text-center ${file ? 'text-[#CFAE68] font-medium' : 'text-white/50'}`}>
            {file?.name ?? 'Seleccioná un archivo .xlsx para importar'}
          </p>
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="px-8 py-3 bg-[#872F31] text-white text-sm font-semibold rounded-xl hover:ring-2 hover:ring-[#CFAE68] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
          >
            {loading ? 'Importando...' : 'Importar'}
          </button>
          {file && (
            <button
              onClick={handleReset}
              className="px-6 cursor-pointer not-last-of-type:py-3 border border-[#CFAE68]/40 text-[#CFAE68]/50 text-sm rounded-xl hover:border-[#CFAE68] hover:text-[#CFAE68] transition-all duration-200"
            >
              Limpiar
            </button>
          )}
        </div>

        {result && (
          <div className="border-l-2 border-[#CFAE68] bg-[#CFAE68]/4 rounded-r-xl p-5">
            <p className="text-white font-semibold text-sm">{result.message}</p>
            {result.errors.length > 0 && (
              <div className="mt-3">
                <p className="text-[#CFAE68]/50 text-xs font-medium mb-1">Filas con errores:</p>
                <ul className="space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-[#CFAE68]/40 text-xs font-mono">{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="border-l-2 border-[#872F31] bg-[#872F31]/6 rounded-r-xl p-5">
            <p className="text-white/80 text-sm">{error}</p>
          </div>
        )}

      </div>

    </div>
  )
}

export default ImportProducts
