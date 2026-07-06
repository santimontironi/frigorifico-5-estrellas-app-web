import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UseAuth from '../../hooks/UseAuth'
import useCart from '../../hooks/useCart'
import Swal from 'sweetalert2'

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Sobre nosotros', to: '/sobre-nosotros' },
  { label: 'Contacto', to: '/contacto' },
]

const navLinkClass =
  'relative text-[#C9BFB5] text-xs tracking-[0.15em] uppercase font-medium ' +
  'hover:text-[#F2EDE6] transition-colors duration-200 ' +
  'after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 ' +
  'after:bg-[#9B2335] after:transition-[width] after:duration-300 hover:after:w-full'

const primaryBtnClass =
  'bg-[#8B1A2F] text-[#F2EDE6] text-xs tracking-[0.12em] uppercase ' +
  'hover:bg-[#A82640] transition-colors duration-200'

const ghostBtnClass =
  'text-[#C9BFB5] text-xs tracking-[0.12em] uppercase border border-[#C9BFB5]/25 ' +
  'hover:border-[#9B2335] hover:text-[#F2EDE6] transition-colors duration-200 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

// botón ícono del carrito — misma familia visual que ghostBtnClass, huella cuadrada para el ícono
const cartBtnClass =
  'relative flex items-center justify-center w-9 h-9 shrink-0 text-[#C9BFB5] ' +
  'border border-[#C9BFB5]/25 hover:border-[#9B2335] hover:text-[#F2EDE6] ' +
  'transition-colors duration-200'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { auth, isAdmin, loading, logout } = UseAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  const close = () => setIsOpen(false)

  const panelPath = isAdmin ? '/panel-admin' : '/panel-usuario'

  const handleLogout = async () => {
    try {
      await Swal.fire({
        title: 'Cerrar sesión',
        html: 'Estás a punto de salir de tu cuenta.<br/>¿Querés continuar?',
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        focusCancel: true,
        confirmButtonColor: '#8B1A2F',
        cancelButtonColor: '#8A8078',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        background: '#F5F0E8',
        color: '#1A1416',
        iconColor: '#9B2335',
        backdrop: 'rgba(15, 5, 7, 0.55)',
        width: 420,
        padding: '2rem 1.5rem',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await logout()
        }
      })
    } finally {
      close()
      navigate('/')
    }
  }

  return (
    <header className="bg-[#121212] border-b border-[#9B2335] sticky top-0 z-50">

      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        <Link to="/" onClick={close} className="flex items-center">
          <img src="/images/logo2.png" alt="Frigorífico 5 Estrellas" className="w-30 h-30 object-contain" />
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link to={to} className={navLinkClass}>{label}</Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">

          {!loading.me && (
            <div className="hidden md:flex items-center gap-3 pl-6 border-l border-[#F7EA79]/40">
              {auth ? (
                <>
                  <Link to={panelPath} className={`${primaryBtnClass} px-4 py-2`}>Mi panel</Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loading.logout}
                    className={`${ghostBtnClass} px-4 py-2 cursor-pointer`}
                  >
                    {loading.logout ? 'Saliendo...' : 'Cerrar sesión'}
                  </button>
                </>
              ) : (
                <Link to="/ingreso" className={`${primaryBtnClass} px-4 py-2`}>Ingresar</Link>
              )}
            </div>
          )}

          <Link
            to="/carrito"
            onClick={close}
            className={cartBtnClass}
            aria-label={itemCount > 0 ? `Carrito de compras, ${itemCount} ${itemCount === 1 ? 'artículo' : 'artículos'}` : 'Carrito de compras, vacío'}
          >
            <i className="bi bi-cart3 text-base" aria-hidden="true" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[1.1rem] h-[1.1rem] px-1 flex items-center justify-center rounded-full bg-[#8B1A2F] text-[#F2EDE6] text-[10px] font-semibold leading-none border border-[#F7EA79]/50">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.25 w-8 h-8 cursor-pointer"
            onClick={() => setIsOpen(prev => !prev)}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
          >
            <span className={`block h-px w-5 bg-[#C9BFB5] transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-px w-5 bg-[#C9BFB5] transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-px w-5 bg-[#C9BFB5] transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>

        </div>

      </nav>

      <div className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pt-2 pb-6 flex flex-col gap-6 border-t border-[#9B2335]/30">

            <ul className="flex flex-col gap-5">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} onClick={close} className="block text-[#C9BFB5] text-xs tracking-[0.15em] uppercase font-medium hover:text-[#F2EDE6] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {!loading.me && (
              <div className="flex gap-3 pt-4 border-t border-[#F7EA79]/40">
                {auth ? (
                  <>
                    <Link to={panelPath} onClick={close} className={`${primaryBtnClass} flex-1 text-center px-4 py-2.5`}>Mi panel</Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loading.logout}
                      className={`${ghostBtnClass} flex-1 text-center px-4 py-2.5 cursor-pointer`}
                    >
                      {loading.logout ? 'Saliendo...' : 'Cerrar sesión'}
                    </button>
                  </>
                ) : (
                  <Link to="/ingreso" onClick={close} className={`${primaryBtnClass} flex-1 text-center px-4 py-2.5`}>Ingresar</Link>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

    </header>
  )
}

export default Header
