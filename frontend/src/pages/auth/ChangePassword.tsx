import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetPasswordSchema } from "../../../../shared/index.js"
import type { ResetPasswordCredentials } from "../../types/user.types"
import UseUser from "../../hooks/UseUser"
import DiagonalLines from "../../components/ui/DiagonalLines"

const ChangePassword = () => {

  const { token } = useParams<{ token: string }>()

  const { changePassword, loading } = UseUser()

  const [success, setSuccess] = useState<string | null>(null)
  const [errorResponse, setErrorResponse] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordCredentials>({
    resolver: zodResolver(ResetPasswordSchema),
  })

  async function onSubmit(data: ResetPasswordCredentials) {
    if (!token) {
      setErrorResponse("No se proporcionó el token")
      return
    }

    try {
      setErrorResponse(null)
      await changePassword(token, data.newPassword)
      setSuccess("Tu contraseña fue actualizada correctamente. Ya podés iniciar sesión con tu nueva clave.")
    } catch (error: any) {
      setErrorResponse(error.response?.data?.message ?? "No pudimos actualizar tu contraseña. El enlace puede haber expirado o ser inválido.")
    }
  }

  const fieldClasses = "w-full rounded-xl border border-white/10 bg-[#120A0C] px-4 py-3 pl-11 text-[#F2EDE6] placeholder:text-[#C9BFB5]/35 transition-all duration-200 focus:border-[#9B2335] focus:outline-none focus:shadow-[0_0_0_3px_rgba(155,35,53,0.18)]"
  const labelClasses = "block text-[#C9BFB5] text-xs tracking-[0.2em] uppercase font-mono mb-2"
  const errorClasses = "flex items-center gap-1.5 text-[#C9405A] text-xs mt-2"

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex items-center justify-center px-6 py-16">
      <DiagonalLines />

      <div className="relative z-10 w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0F0507]/80 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 md:p-10">

          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-0.5 w-10 bg-[#9B2335] shadow-[0_0_12px_rgba(155,35,53,0.8)]" />
            <span className="text-[#9B2335] text-xs tracking-[0.3em] uppercase font-mono font-semibold">Frigorífico 5 Estrellas</span>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center gap-5 py-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#9B2335]/15 border border-[#9B2335]/40">
                <i className="bi bi-shield-check text-[#C9405A] text-4xl" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-[#F2EDE6] text-2xl font-bold tracking-tight">¡Contraseña actualizada!</h1>
                <p className="text-[#C9BFB5]/70 text-sm mt-2 leading-relaxed max-w-xs mx-auto">{success}</p>
              </div>
              <Link
                to="/ingreso"
                className="mt-1 flex items-center justify-center gap-2 w-full bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
              >
                <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
                Iniciar sesión
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#9B2335]/15 border border-[#9B2335]/40 flex items-center justify-center mb-5">
                  <i className="bi bi-key text-[#C9405A] text-2xl" aria-hidden="true" />
                </div>
                <h1 className="text-[#F2EDE6] text-2xl font-bold tracking-tight">Nueva contraseña</h1>
                <p className="text-[#C9BFB5]/70 text-sm mt-2 leading-relaxed">
                  Definí una nueva contraseña para tu cuenta.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

                {errorResponse && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#9B2335]/40 bg-[#9B2335]/10 px-4 py-3">
                    <i className="bi bi-exclamation-triangle text-[#C9405A] text-lg shrink-0" aria-hidden="true" />
                    <p className="text-[#F2EDE6] text-sm">{errorResponse}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="newPassword" className={labelClasses}>Nueva contraseña</label>
                  <div className="relative">
                    <i className="bi bi-lock absolute left-4 top-1/2 -translate-y-1/2 text-[#C9BFB5]/40" aria-hidden="true" />
                    <input
                      id="newPassword"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      className={fieldClasses}
                      {...register("newPassword")}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className={errorClasses}>
                      <i className="bi bi-exclamation-circle" aria-hidden="true" />
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading.changePassword}
                  className="mt-1 flex items-center justify-center gap-2 w-full bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {loading.changePassword ? "Guardando..." : "Actualizar contraseña"}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </main>
  )
}

export default ChangePassword
