import DiagonalLines from '../ui/DiagonalLines'
import InfoCard from './InfoCard'

const WelcomeAdmin = () => {
  return (
    <div className="w-full min-h-full bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex flex-col relative overflow-hidden">

      <DiagonalLines />

      <div className="relative z-10 px-6 py-7 md:px-10 md:py-9 border-b border-white/8">
        <div className="flex items-center gap-2 mb-4">
          <i className="bi bi-shop text-[#9B2335] text-xs" aria-hidden="true" />
          <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Panel admin</span>
        </div>
        <h1 className="text-white text-2xl md:text-4xl font-bold mb-2 tracking-tight">Hola, administrador</h1>
        <p className="text-white/70 text-sm md:text-base max-w-xl">
          Este es el panel de gestión del frigorífico. Usá el menú lateral para moverte entre las secciones; acá abajo te contamos qué podés hacer en cada una.
        </p>
      </div>

      <div className="relative z-10 flex-1 p-6 md:p-10 flex flex-col gap-8">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-grid text-[#9B2335] text-sm" aria-hidden="true" />
            <span className="text-white/70 text-xs uppercase tracking-[0.18em] font-medium">Qué podés hacer en el panel</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <InfoCard
              icon="bi bi-box-seam"
              title="Productos"
              description="Consultá y administrá el catálogo completo de productos cargados."
            />
            <InfoCard
              icon="bi bi-plus-circle"
              title="Agregar producto"
              description="Sumá un nuevo producto al catálogo con precio, unidad y categoría."
            />
            <InfoCard
              icon="bi bi-upload"
              title="Importar productos"
              description="Cargá productos en masa desde un archivo Excel estructurado."
            />
            <InfoCard
              icon="bi bi-receipt"
              title="Pedidos"
              description="Vas a poder revisar y gestionar los pedidos entrantes desde acá."
              comingSoon
            />
          </div>
        </div>

        <div className="border-l-4 border-[#F7EA79]/50 bg-[#F7EA79]/5 rounded-r-xl p-6 md:p-7 flex items-start gap-3">
          <i className="bi bi-lightbulb-fill text-[#F7EA79] text-lg mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-white/70 text-sm md:text-base">
            Tip: si vas a cargar muchos productos de una sola vez, usá <span className="text-white font-semibold">Importar productos</span> con un archivo Excel en lugar de cargarlos uno por uno.
          </p>
        </div>

      </div>

    </div>
  )
}

export default WelcomeAdmin
