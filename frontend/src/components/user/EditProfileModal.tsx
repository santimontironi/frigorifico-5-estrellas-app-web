import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EditProfileSchema } from "../../../../shared/index.js"
import type { UserProfile } from "../../types/auth.types"
import type { EditProfileCredentials } from "../../types/user.types"
import UseAuth from "../../hooks/UseAuth"
import UseUser from "../../hooks/UseUser"

interface EditProfileModalProps {
  profile: UserProfile
  onClose: () => void
}

const EditProfileModal = ({ profile, onClose }: EditProfileModalProps) => {

  const { editProfile, loading } = UseUser()
  const { logout } = UseAuth()
  const navigate = useNavigate()

  const [success, setSuccess] = useState<string | null>(null)
  const [errorResponse, setErrorResponse] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<EditProfileCredentials>({
    resolver: zodResolver(EditProfileSchema),

    defaultValues: {
      email: profile.email,
      phone: profile.phone,
      address: {
        street: profile.address.street,
        number: profile.address.number,
        floor: profile.address.floor ?? '',
        apartment: profile.address.apartment ?? '',
        city: profile.address.city,
        province: profile.address.province,
      },
    },
  })

  async function onSubmit(data: EditProfileCredentials) {
    try {
      setErrorResponse(null)
      const res = await editProfile(data)

      // Si cambió el email, el back ya borró la cookie: la sesión murió.
      // No se cierra el modal, se muestra el aviso y se manda al ingreso.
      if (res.emailChanged) {
        setSuccess(res.message)
        return
      }

      onClose()
    } catch (error: any) {
      setErrorResponse(error.response?.data?.message ?? "No pudimos guardar los cambios. Intentá nuevamente.")
    }
  }

  async function handleGoToLogin() {
    try {
      await logout()
    } catch {
    }
    navigate('/ingreso')
  }

  const inputClass = "w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm px-4 py-3 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 placeholder:text-[#B8A898]/60"
  const labelClass = "text-[#7A6B63] text-xs font-medium ml-1"
  const errorClass = "text-[#9B2335] text-xs ml-1"

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-6 py-10"
      role="dialog"
      aria-modal="true"
    >

      <div
        className="absolute inset-0 bg-[#0F0507]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] animate-[fadeIn_0.2s_ease-out]">

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-[#7A6B63] hover:bg-[#F7F4F1] hover:text-[#9B2335] transition-colors duration-200 cursor-pointer"
        >
          <i className="bi bi-x-lg text-base" aria-hidden="true" />
        </button>

        <div className="px-8 pt-10 pb-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-[#9B2335] to-[#4A0E18] flex items-center justify-center mb-5 shadow-lg">
            <i className="bi bi-pencil-square text-white text-2xl" aria-hidden="true" />
          </div>
          <h2 className="text-[#1C1714] text-xl font-bold tracking-wide">
            Editar mis datos
          </h2>
          <p className="text-[#7A6B63] text-sm mt-2 leading-relaxed">
            Podés actualizar tu email, teléfono y domicilio de entrega.
          </p>
        </div>

        <div className="mx-8 h-px bg-linear-to-r from-transparent via-[#E8DFD6] to-transparent" />

        <div className="px-8 pt-6 pb-10">

          {success ? (
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#9B2335]/10">
                <i className="bi bi-envelope-check text-[#9B2335] text-2xl" aria-hidden="true" />
              </div>
              <p className="text-[#1C1714] text-sm leading-relaxed">{success}</p>
              <p className="text-[#7A6B63] text-xs leading-relaxed">
                Por seguridad cerramos tu sesión. Vas a poder ingresar de nuevo apenas confirmes tu nuevo email.
              </p>
              <button
                type="button"
                onClick={handleGoToLogin}
                className="w-full cursor-pointer bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-[0.12em] py-3.5 mt-2 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200"
              >
                Ir al ingreso
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {errorResponse && (
                <div className="flex items-center gap-3 bg-[#9B2335]/5 rounded-xl px-4 py-3">
                  <i className="bi bi-exclamation-circle text-[#9B2335] text-lg shrink-0" aria-hidden="true" />
                  <p className="text-[#9B2335] text-sm">{errorResponse}</p>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className={inputClass}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
                <span className="text-[#B8A898] text-xs ml-1">
                  Si cambiás el email vas a tener que confirmarlo desde tu casilla.
                </span>
                {errors.email && <span className={errorClass}>{errors.email.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Teléfono</label>
                <input
                  type="tel"
                  {...register("phone")}
                  className={inputClass}
                  placeholder="1122334455"
                  autoComplete="tel"
                />
                {errors.phone && <span className={errorClass}>{errors.phone.message}</span>}
              </div>

              <div className="h-px bg-[#E8DFD6] my-1" />

              <p className="text-[#7A6B63] text-xs uppercase tracking-[0.18em] font-medium ml-1">
                Domicilio de entrega
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className={labelClass}>Calle</label>
                  <input
                    type="text"
                    {...register("address.street")}
                    className={inputClass}
                    placeholder="Av. Siempre Viva"
                  />
                  {errors.address?.street && <span className={errorClass}>{errors.address.street.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Número</label>
                  <input
                    type="text"
                    {...register("address.number")}
                    className={inputClass}
                    placeholder="742"
                  />
                  {errors.address?.number && <span className={errorClass}>{errors.address.number.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Piso (opcional)</label>
                  <input
                    type="text"
                    {...register("address.floor")}
                    className={inputClass}
                    placeholder="3"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Depto (opcional)</label>
                  <input
                    type="text"
                    {...register("address.apartment")}
                    className={inputClass}
                    placeholder="B"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Localidad</label>
                  <input
                    type="text"
                    {...register("address.city")}
                    className={inputClass}
                    placeholder="Rosario"
                  />
                  {errors.address?.city && <span className={errorClass}>{errors.address.city.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Provincia</label>
                  <input
                    type="text"
                    {...register("address.province")}
                    className={inputClass}
                    placeholder="Santa Fe"
                  />
                  {errors.address?.province && <span className={errorClass}>{errors.address.province.message}</span>}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading.editProfile}
                className="w-full cursor-pointer bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm font-bold tracking-[0.12em] py-4 mt-1 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading.editProfile ? "Guardando..." : "Guardar cambios"}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default EditProfileModal
