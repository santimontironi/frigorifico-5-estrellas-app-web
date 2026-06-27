import { useState } from 'react'
import { Link } from 'react-router-dom'

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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const close = () => setIsOpen(false)

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

        <div className="hidden md:flex items-center gap-3 pl-6 border-l border-[#F7EA79]/40">
          <Link to="/ingreso-usuario" className="border border-[#C9BFB5]/40 text-[#C9BFB5] text-xs tracking-[0.12em] uppercase px-4 py-2 hover:bg-[#C9BFB5]/10 hover:border-[#C9BFB5] transition-all duration-200">Mi panel</Link>
          <Link to="/ingreso-admin" className="bg-[#8B1A2F] text-[#F2EDE6] text-xs tracking-[0.12em] uppercase px-4 py-2 hover:bg-[#A82640] transition-colors duration-200">Admin</Link>
        </div>

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

            <div className="flex gap-3 pt-4 border-t border-[#F7EA79]/40">
              <Link to="/ingreso-usuario" onClick={close} className="flex-1 text-center border border-[#C9BFB5]/40 text-[#C9BFB5] text-xs tracking-[0.12em] uppercase px-4 py-2.5 hover:bg-[#C9BFB5]/10 hover:border-[#C9BFB5] transition-all duration-200">Mi panel</Link>
              <Link to="/ingreso-admin" onClick={close} className="flex-1 text-center bg-[#8B1A2F] text-[#F2EDE6] text-xs tracking-[0.12em] uppercase px-4 py-2.5 hover:bg-[#A82640] transition-colors duration-200">Admin</Link>
            </div>

          </div>
        </div>
      </div>

    </header>
  )
}

export default Header
