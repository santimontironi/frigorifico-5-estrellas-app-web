import type { ProfileResponse } from "../../types/auth.types"
import type { viewDashboardUser } from "../../types/general.types"
import UseAuth from "../../hooks/UseAuth"
import { useNavigate } from "react-router-dom"

type sideNavUserProps = {
    profile: ProfileResponse | null,
    viewUser: viewDashboardUser,
    setViewUser: (view: viewDashboardUser) => void,
    isOpen: boolean,
    onClose: () => void
}

const navItems: { label: string; view: viewDashboardUser; icon: string }[] = [
  { label: 'Inicio',      view: 'welcome',   icon: 'bi bi-house' },
  { label: 'Mi perfil',   view: 'myProfile', icon: 'bi bi-person' },
  { label: 'Mis pedidos', view: 'myOrders',  icon: 'bi bi-bag-check' },
]

const SideNavUser = ({ profile, viewUser, setViewUser, isOpen, onClose }: sideNavUserProps) => {
  const { logout, loading } = UseAuth()
  const navigate = useNavigate()

  const isUserProfile = profile !== null && 'firstName' in profile
  const displayName = isUserProfile ? `${profile.firstName} ${profile.lastName}` : ''
  const initials = isUserProfile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : ''

  const handleLogout = async () => {
    await logout()
    navigate('/ingreso')
  }

  const handleNavClick = (view: viewDashboardUser) => {
    setViewUser(view)
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
          <p className="text-[#F7EA79] text-xs font-semibold tracking-[0.15em] uppercase">Mi cuenta</p>
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

      {isUserProfile && (
        <div className="px-6 py-5 border-b border-white/8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F7EA79]/15 border border-[#F7EA79]/30 flex items-center justify-center shrink-0">
            <span className="text-[#F7EA79] text-sm font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{displayName}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = viewUser === item.view
          return (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left
                ${isActive
                  ? 'bg-[#F7EA79] text-[#0A0A0A] shadow-lg shadow-[#F7EA79]/15'
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

export default SideNavUser
