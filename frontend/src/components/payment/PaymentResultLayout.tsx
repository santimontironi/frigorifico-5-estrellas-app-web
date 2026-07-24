import { Link } from 'react-router-dom'
import Header from '../ui/Header'
import DiagonalLines from '../ui/DiagonalLines'

interface PaymentResultLayoutProps {
  icon: string
  iconWrap: string
  iconColor: string
  accent: string
  title: string
  message: string
}

// Layout visual compartido por las páginas de resultado de pago.
// Cada página (éxito, error, pendiente) le pasa su ícono, colores y copy.
const PaymentResultLayout = ({ icon, iconWrap, iconColor, accent, title, message }: PaymentResultLayoutProps) => {
  return (
    <section className="min-h-screen bg-[#0A0A0A]">
      <Header />

      <div className="relative overflow-hidden border-b border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]">
        <DiagonalLines />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:px-10 md:py-28 flex flex-col items-center text-center">
          <span className={`flex items-center justify-center w-20 h-20 rounded-full border ${iconWrap} mb-8`}>
            <i className={`bi ${icon} ${iconColor} text-4xl`} aria-hidden="true" />
          </span>

          <h1 className="text-[#F2EDE6] text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            <span className={accent}>{title}</span>
          </h1>

          <p className="text-[#C9BFB5]/70 text-base md:text-lg mt-6 max-w-xl leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Link
              to="/panel-usuario"
              className="flex items-center gap-2 bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
            >
              <i className="bi bi-bag-check" aria-hidden="true" />
              Ver mis pedidos
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-[#C9BFB5] text-xs tracking-[0.15em] uppercase font-medium hover:text-[#F2EDE6] transition-colors duration-200"
            >
              <i className="bi bi-arrow-left" aria-hidden="true" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PaymentResultLayout
