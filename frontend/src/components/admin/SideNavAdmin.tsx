import type { viewDashboardAdmin } from '../../types/general.types'
import UseAuth from '../../hooks/UseAuth'
import { useNavigate } from 'react-router-dom'

interface Props {
  viewAdmin: viewDashboardAdmin
  setViewAdmin: (view: viewDashboardAdmin) => void
  isOpen: boolean
  onClose: () => void
}

const navItems: { label: string; view: viewDashboardAdmin; icon: string }[] = [
  { label: 'Inicio',             view: 'welcome',        icon: 'bi bi-house' },
  { label: 'Productos',          view: 'products',       icon: 'bi bi-box-seam' },
  { label: 'Agregar producto',   view: 'addProduct',     icon: 'bi bi-plus-circle' },
  { label: 'Importar productos', view: 'importProducts', icon: 'bi bi-upload' },
  { label: 'Categorías',         view: 'categories',     icon: 'bi bi-collection' },
  { label: 'Pedidos',            view: 'orders',         icon: 'bi bi-receipt' },
]

const SideNavAdmin = ({ viewAdmin, setViewAdmin, isOpen, onClose }: Props) => {
  const { logout, loading } = UseAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin')
    } catch {}
  }

  const handleNavClick = (view: viewDashboardAdmin) => {
    setViewAdmin(view)
    onClose()
  }

  return (
    <aside className={`
      fixed md:static inset-y-0 left-0 z-50
      w-64 min-h-screen bg-[#121212] border-r border-white/8 flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>

      <div className="px-6 py-6 border-b border-white/8 flex items-center justify-between">
        <div>
          <p className="text-[#9B2335] text-xs font-semibold tracking-[0.15em] uppercase">Panel admin</p>
          <h2 className="text-white text-base font-bold tracking-wide mt-0.5">Frigorífico ★</h2>
        </div>
        <button
          onClick={onClose}
          className="md:hidden text-white/40 hover:text-white transition-colors cursor-pointer"
          aria-label="Cerrar menú"
        >
          <i className="bi bi-x-lg text-lg" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = viewAdmin === item.view
          return (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left
                ${isActive
                  ? 'bg-[#9B2335] text-white shadow-lg shadow-[#9B2335]/20'
                  : 'text-white/50 hover:text-white hover:bg-white/6'
                }`}
            >
              <i className={`${item.icon} text-base w-4 text-center`} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-white/8 pt-3">
        <button
          onClick={handleLogout}
          disabled={loading.logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/35 hover:text-red-400 hover:bg-red-400/8 transition-all duration-200 cursor-pointer"
        >
          <i className="bi bi-box-arrow-right text-base w-4 text-center" />
          {loading.logout ? 'Saliendo...' : 'Cerrar sesión'}
        </button>
      </div>

    </aside>
  )
}

export default SideNavAdmin
