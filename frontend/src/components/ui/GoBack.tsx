import { Link } from 'react-router-dom'

interface GoBackProps {
  href: string
  label?: string
}

const GoBack = ({ href, label = 'Volver al inicio' }: GoBackProps) => {
  return (
    <Link
      to={href}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200 cursor-pointer"
    >
      <i className="bi bi-arrow-left text-base w-4 text-center" />
      {label}
    </Link>
  )
}

export default GoBack
