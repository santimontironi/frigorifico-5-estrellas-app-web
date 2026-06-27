import type { viewDashboardAdmin } from '../types/general.types'
import UseAuth from '../hooks/UseAuth'
import { useNavigate } from 'react-router-dom'

interface Props {
  viewAdmin: viewDashboardAdmin
  setViewAdmin: (view: viewDashboardAdmin) => void
}

const navItems: { label: string; view: viewDashboardAdmin; icon: string }[] = [
  { label: 'Inicio',             view: 'welcome',        icon: 'bi bi-house' },
  { label: 'Productos',          view: 'products',       icon: 'bi bi-box-seam' },
  { label: 'Agregar producto',   view: 'addProduct',     icon: 'bi bi-plus-circle' },
  { label: 'Importar productos', view: 'importProducts', icon: 'bi bi-upload' },
  { label: 'Pedidos',            view: 'orders',         icon: 'bi bi-receipt' },
]

const SideNavAdmin = ({ viewAdmin, setViewAdmin }: Props) => {
  const { logout, loading } = UseAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin')
    } catch {}
  }

  return (
    <aside className="w-64 min-h-screen bg-[#1C1714] flex flex-col">

      <div className="px-6 py-8 border-b border-white/10">
        <p className="text-[#9B2335] text-[15px] font-bold">
          Panel admin
        </p>
        <h2 className="text-white text-lg font-bold tracking-wide mt-1">
          Frigorífico ★
        </h2>
      </div>

      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = viewAdmin === item.view
          return (
            <button
              key={item.view}
              onClick={() => setViewAdmin(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left
                ${isActive
                  ? 'bg-[#9B2335] text-white shadow-lg shadow-[#9B2335]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              <i className={`${item.icon} text-base`} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          disabled={loading.logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          <i className="bi bi-box-arrow-right text-base" />
          {loading.logout ? 'Saliendo...' : 'Cerrar sesión'}
        </button>
      </div>

    </aside>
  )
}

export default SideNavAdmin
