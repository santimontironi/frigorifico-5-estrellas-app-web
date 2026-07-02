import { Link } from "react-router-dom"
import Header from "../components/ui/Header"
import DiagonalLines from "../components/ui/DiagonalLines"
import InfoCard from "../components/admin/InfoCard"

const AboutUs = () => {
  return (
    <section className="min-h-screen bg-[#0A0A0A]">
      <Header />
      <div className="relative overflow-hidden border-b border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]">

        <DiagonalLines />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:px-10 md:py-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-0.5 w-12 bg-[#9B2335] shadow-[0_0_12px_rgba(155,35,53,0.8)]" />
            <span className="text-[#9B2335] text-xs tracking-[0.3em] uppercase font-mono font-semibold">Sobre nosotros</span>
          </div>

          <h1 className="text-[#F2EDE6] text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
            Tradición carnicera, <span className="text-[#C9405A] [text-shadow:0_0_28px_rgba(155,35,53,0.6)]">frescura</span> de frigorífico
          </h1>

          <p className="text-[#C9BFB5]/70 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
            Somos <span className="text-[#F2EDE6] font-semibold">Frigorífico 5 Estrellas</span>. Trabajamos la carne
            como se hacía siempre: con oficio, respeto por el producto y un compromiso diario con la calidad.
            De nuestra cámara a tu mesa, sin intermediarios.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:px-10 md:py-20">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-16 items-center">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <i className="bi bi-clock-history text-[#9B2335] text-sm" aria-hidden="true" />
              <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Nuestra historia</span>
            </div>

            <h2 className="text-[#F2EDE6] text-2xl md:text-3xl font-bold tracking-tight mb-6">
              Un oficio que se hereda, una calidad que se elige
            </h2>

            <div className="space-y-5 text-[#C9BFB5]/70 text-base leading-relaxed">
              <p>
                Nacimos como un negocio familiar y hoy abastecemos a cientos de familias y comercios con
                cortes seleccionados. Ese origen sigue marcando cómo trabajamos: conocemos cada corte, cada
                proveedor y cada cliente por su nombre.
              </p>
              <p>
                Controlamos la cadena de frío de principio a fin y elegimos personalmente la mercadería que
                entra a nuestra cámara. Si no la comeríamos en casa, no la vendemos.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] p-8 md:p-10">
            <i className="bi bi-star-fill absolute -bottom-8 -right-6 text-[#9B2335]/10 text-[10rem] -rotate-12" aria-hidden="true" />

            <div className="relative z-10 grid grid-cols-2 gap-8">
              <div>
                <p className="text-[#F7EA79] text-4xl md:text-5xl font-bold font-mono tracking-tight">+20</p>
                <p className="text-[#C9BFB5]/70 text-sm mt-2">Años de trayectoria</p>
              </div>
              <div>
                <p className="text-[#F7EA79] text-4xl md:text-5xl font-bold font-mono tracking-tight">9</p>
                <p className="text-[#C9BFB5]/70 text-sm mt-2">Categorías de productos</p>
              </div>
              <div>
                <p className="text-[#F7EA79] text-4xl md:text-5xl font-bold font-mono tracking-tight">100%</p>
                <p className="text-[#C9BFB5]/70 text-sm mt-2">Cadena de frío controlada</p>
              </div>
              <div>
                <p className="text-[#F7EA79] text-4xl md:text-5xl font-bold font-mono tracking-tight">+500</p>
                <p className="text-[#C9BFB5]/70 text-sm mt-2">Clientes que nos eligen</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/8 bg-[#0C0708]">
        <div className="max-w-7xl mx-auto px-6 py-12 md:px-10 md:py-20">

          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 mb-3">
              <i className="bi bi-award text-[#9B2335] text-sm" aria-hidden="true" />
              <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Lo que nos define</span>
            </div>
            <h2 className="text-[#F2EDE6] text-2xl md:text-3xl font-bold tracking-tight">Nuestros valores</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            <InfoCard
              icon="bi bi-snow"
              title="Frescura garantizada"
              description="Cadena de frío controlada desde la cámara hasta tu domicilio para que la carne llegue en su punto justo."
            />
            <InfoCard
              icon="bi bi-patch-check"
              title="Calidad seleccionada"
              description="Elegimos personalmente cada corte y cada proveedor. Solo entra a nuestra cámara lo que estamos orgullosos de vender."
            />
            <InfoCard
              icon="bi bi-cash-coin"
              title="Precios mayoristas"
              description="Al trabajar directo del frigorífico, sin intermediarios, ofrecemos los mejores precios del mercado."
            />
            <InfoCard
              icon="bi bi-truck"
              title="Envío a domicilio"
              description="Recibí tu pedido en casa. Coordinamos la entrega para que no tengas que salir a buscar tus cortes."
            />
            <InfoCard
              icon="bi bi-people"
              title="Atención cercana"
              description="Somos un negocio familiar. Conocemos a nuestros clientes y los asesoramos en cada compra."
            />
            <InfoCard
              icon="bi bi-shield-check"
              title="Confianza y trazabilidad"
              description="Sabemos de dónde viene cada producto. Transparencia total en el origen y el manejo de la mercadería."
            />
          </div>

        </div>
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden border-t border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]">
        <DiagonalLines />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:px-10 md:py-24 text-center">
          <h2 className="text-[#F2EDE6] text-3xl md:text-4xl font-bold tracking-tight leading-tight max-w-2xl mx-auto">
            ¿Listo para probar la diferencia?
          </h2>
          <p className="text-[#C9BFB5]/70 text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
            Descubrí nuestros cortes premium y hacé tu pedido en minutos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link
              to="/"
              className="flex items-center gap-2 bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
            >
              <i className="bi bi-shop text-base" aria-hidden="true" />
              Ver catálogo
            </Link>
            <Link
              to="/contacto"
              className="flex items-center gap-2 border border-[#C9BFB5]/40 text-[#C9BFB5] text-sm tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#C9BFB5]/10 hover:border-[#C9BFB5]"
            >
              <i className="bi bi-chat-dots text-base" aria-hidden="true" />
              Contactanos
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}

export default AboutUs
