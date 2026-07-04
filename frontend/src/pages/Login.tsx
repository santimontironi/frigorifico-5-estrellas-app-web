import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import UseAuth from '../hooks/UseAuth'
import type { LoginCredentials } from '../types/auth.types'

const Login = () => {
  const { login, loading } = UseAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<any>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError(null)
      const res = await login(data)
      navigate(res.role === 'admin' ? '/panel-admin' : '/panel-usuario')
    } catch (err: any) {
      setError(err?.response?.data?.message)
      reset()
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-[#9B2335] via-[#7A1C2A] to-[#4A0E18] flex items-center justify-center px-6 py-12 relative overflow-hidden">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            -35deg,
            transparent,
            transparent 50px,
            rgba(255, 255, 255, 0.06) 50px,
            rgba(255, 255, 255, 0.06) 51px
          )`
        }}
      />

      <div className="absolute -top-20 left-[15%] w-px h-[140%] bg-linear-to-b from-transparent via-white/15 to-transparent rotate-[-25deg]" />
      <div className="absolute -top-20 left-[45%] w-0.5 h-[140%] bg-linear-to-b from-transparent via-white/10 to-transparent rotate-20" />
      <div className="absolute -top-20 right-[20%] w-px h-[140%] bg-linear-to-b from-transparent via-white/12 to-transparent rotate-[-15deg]" />

      <div className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl relative z-10">

        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden relative">

          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `repeating-linear-gradient(
                -35deg,
                transparent,
                transparent 50px,
                rgba(155, 35, 53, 0.07) 50px,
                rgba(155, 35, 53, 0.07) 51px
              )`
            }}
          />

          <div className="px-8 pt-10 pb-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-[#9B2335] to-[#4A0E18] flex items-center justify-center mb-5 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <h1 className="text-[#1C1714] text-xl xl:text-2xl 2xl:text-3xl font-bold tracking-wide">
              Ingresá a tu cuenta
            </h1>
            <p className="text-[#9B2335] text-[10px] xl:text-xs 2xl:text-sm tracking-[0.3em] mt-2">
              Frigorífico 5 Estrellas
            </p>
          </div>

          <div className="mx-8 h-px bg-linear-to-r from-transparent via-[#E8DFD6] to-transparent" />

          <div className="px-8 pt-6 pb-10">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {error && (
                <div className="flex items-center gap-3 bg-[#9B2335]/5 rounded-xl px-4 py-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#9B2335] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <p className="text-[#9B2335] text-sm">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[#7A6B63] text-xs xl:text-sm 2xl:text-base font-medium ml-1">
                  Email
                </label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8A898]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <input
                    type="email"
                    {...register('email', { required: 'Ingresá tu email' })}
                    className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm xl:text-base 2xl:text-lg pl-12 pr-4 py-3.5 xl:py-4 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 placeholder:text-[#B8A898]/60"
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="text-[#9B2335] text-xs ml-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#7A6B63] text-xs xl:text-sm 2xl:text-base font-medium ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8A898]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <input
                    type="password"
                    {...register('password', { required: 'La contraseña es obligatoria' })}
                    className="w-full bg-[#F7F4F1] rounded-xl text-[#1C1714] text-sm xl:text-base 2xl:text-lg pl-12 pr-4 py-3.5 xl:py-4 outline-none border-2 border-transparent focus:border-[#9B2335]/30 focus:bg-white transition-all duration-200 placeholder:text-[#B8A898]/60"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                {errors.password && (
                  <span className="text-[#9B2335] text-xs ml-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading.login}
                className="w-full cursor-pointer bg-linear-to-r from-[#9B2335] to-[#7A1C2A] text-white text-sm xl:text-base 2xl:text-lg font-bold tracking-[0.12em] py-4 xl:py-5 mt-3 rounded-xl shadow-lg hover:shadow-xl hover:from-[#B82A40] hover:to-[#9B2335] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading.login ? 'Verificando...' : 'Ingresar'}
              </button>

            </form>
          </div>

        </div>

      </div>
    </main>
  )
}

export default Login
