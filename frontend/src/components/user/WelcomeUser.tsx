import { useNavigate } from 'react-router-dom'
import GoldDiagonalLines from '../ui/GoldDiagonalLines'
import UserCard from './UserCard'
import type { viewDashboardUser } from '../../types/general.types'

type WelcomeUserProps = {
  name?: string
  setViewUser: (view: viewDashboardUser) => void
}

const WelcomeUser = ({ name, setViewUser }: WelcomeUserProps) => {
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-full bg-linear-to-br from-[#1C1608] via-[#0F0C05] to-[#0A0A0A] flex flex-col relative overflow-hidden">

      <GoldDiagonalLines />

      <div className="relative z-10 px-6 py-7 md:px-10 md:py-9 border-b border-white/8">
        <div className="flex items-center gap-2 mb-4">
          <i className="bi bi-stars text-[#F7EA79] text-xs" aria-hidden="true" />
          <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Mi cuenta</span>
        </div>
        <h1 className="text-white text-2xl md:text-4xl font-bold mb-2 tracking-tight">
          Hola{name ? `, ${name}` : ''}
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-2xl">
          Bienvenido a tu cuenta del frigorífico. Desde acá seguís tus pedidos, revisás tus datos y gestionás tus pagos. Usá el menú lateral para moverte entre las secciones; abajo te contamos qué podés hacer en cada una.
        </p>
      </div>

      <div className="relative z-10 flex-1 p-6 md:p-10 flex flex-col gap-8">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-grid text-[#F7EA79] text-sm" aria-hidden="true" />
            <span className="text-white/70 text-xs uppercase tracking-[0.18em] font-medium">Qué podés hacer</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <UserCard
              icon="bi bi-shop"
              title="Explorá el catálogo"
              description="Navegá los productos filtrados por categoría y descubrí las ofertas vigentes."
              onClick={() => navigate('/')}
            />
            <UserCard
              icon="bi bi-cart-plus"
              title="Armá tu pedido"
              description="El carrito se arma desde el inicio de la web: agregá productos desde el catálogo y confirmá tu pedido cuando estés listo."
              onClick={() => navigate('/')}
            />
            <UserCard
              icon="bi bi-bag-check"
              title="Mis pedidos"
              description="Seguí el estado de cada pedido: pendiente, aceptado, en preparación y entregado."
              onClick={() => setViewUser('myOrders')}
            />
            <UserCard
              icon="bi bi-person"
              title="Mi perfil"
              description="Consultá tus datos personales y tu domicilio de entrega registrados."
              onClick={() => setViewUser('myProfile')}
            />
            <UserCard
              icon="bi bi-credit-card"
              title="Pagá online"
              description="Cuando tu pedido está en preparación, pagalo con Mercado Pago desde Mis pedidos."
              onClick={() => setViewUser('myOrders')}
            />
          </div>
        </div>

        <div className="border-l-4 border-[#F7EA79]/50 bg-[#F7EA79]/5 rounded-r-xl p-6 md:p-7 flex items-start gap-3">
          <i className="bi bi-lightbulb-fill text-[#F7EA79] text-lg mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-white/70 text-sm md:text-base">
            Tip: como los cortes <span className="text-white font-semibold">por kilo</span> se pesan al momento de preparar tu pedido, el total inicial es aproximado. El monto final lo confirma el frigorífico antes de que pagues.
          </p>
        </div>

      </div>

    </div>
  )
}

export default WelcomeUser
