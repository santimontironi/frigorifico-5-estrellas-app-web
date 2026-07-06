import type { ProfileResponse } from "../../types/auth.types"
import GoldDiagonalLines from "../ui/GoldDiagonalLines"
import ProfileField from "./ProfileField"

interface MyProfileProps {
  profile: ProfileResponse | null
}

const MyProfile = ({ profile }: MyProfileProps) => {

  if (!profile || !('firstName' in profile)) {
    return (
      <div className="w-full min-h-full bg-[#0A0A0A] flex items-center justify-center p-10">
        <p className="text-white/40 text-sm">No se pudieron cargar tus datos.</p>
      </div>
    )
  }

  const fullName = `${profile.firstName} ${profile.lastName}`
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
  const memberSince = new Date(profile.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const { address } = profile
  const addressLine = [
    `${address.street} ${address.number}`,
    address.floor ? `Piso ${address.floor}` : null,
    address.apartment ? `Depto ${address.apartment}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="w-full min-h-full bg-linear-to-br from-[#1C1608] via-[#0F0C05] to-[#0A0A0A] flex flex-col relative overflow-hidden">

      <GoldDiagonalLines />

      <div className="relative z-10 px-6 py-7 md:px-10 md:py-9 border-b border-white/8">
        <div className="flex items-center gap-2 mb-5">
          <i className="bi bi-person text-[#F7EA79] text-xs" aria-hidden="true" />
          <span className="text-white text-xs font-mono uppercase tracking-[0.2em]">Mi perfil</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#F7EA79]/15 border border-[#F7EA79]/30 flex items-center justify-center shrink-0">
            <span className="text-[#F7EA79] text-xl font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight truncate">{fullName}</h1>
            <p className="text-white/50 text-sm truncate">{profile.email}</p>
            <p className="text-white/35 text-xs mt-1">Cliente desde {memberSince}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 p-6 md:p-10 flex flex-col gap-8">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-card-text text-[#F7EA79] text-sm" aria-hidden="true" />
            <span className="text-white/70 text-xs uppercase tracking-[0.18em] font-medium">Datos personales</span>
          </div>
          <div className="bg-[#121212] border border-[#F7EA79]/15 rounded-xl p-6 md:p-7 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-lg shadow-[#F7EA79]/5 transition-colors duration-300 hover:border-[#F7EA79]/30">
            <ProfileField icon="bi bi-person" label="Nombre" value={fullName} />
            <ProfileField icon="bi bi-envelope" label="Email" value={profile.email} />
            <ProfileField icon="bi bi-credit-card-2-front" label="DNI" value={profile.dni} />
            <ProfileField icon="bi bi-telephone" label="Teléfono" value={profile.phone} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <i className="bi bi-geo-alt text-[#F7EA79] text-sm" aria-hidden="true" />
            <span className="text-white/70 text-xs uppercase tracking-[0.18em] font-medium">Domicilio de entrega</span>
          </div>
          <div className="bg-[#121212] border border-[#F7EA79]/15 rounded-xl p-6 md:p-7 grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-lg shadow-[#F7EA79]/5 transition-colors duration-300 hover:border-[#F7EA79]/30">
            <ProfileField icon="bi bi-house-door" label="Dirección" value={addressLine} />
            <ProfileField icon="bi bi-buildings" label="Localidad" value={address.city} />
            <ProfileField icon="bi bi-map" label="Provincia" value={address.province} />
          </div>
        </div>

      </div>

    </div>
  )
}

export default MyProfile
