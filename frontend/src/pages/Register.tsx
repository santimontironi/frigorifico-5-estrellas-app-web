import UseAuth from "../hooks/UseAuth"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import type { UserRegisterCredentials } from "../types/auth.types"
import { userRegisterSchema } from "../../../shared"
import Header from "../components/ui/Header"
import DiagonalLines from "../components/ui/DiagonalLines"

const Register = () => {

    const [success, setSuccess] = useState<string | null>(null)
    const [errorResponse, setErrorResponse] = useState<string | null>(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserRegisterCredentials>({
        resolver: zodResolver(userRegisterSchema)
    })

    const { registerUser, loading } = UseAuth()

    async function submitForm(data: UserRegisterCredentials) {
        try {
            setErrorResponse(null)
            await registerUser(data)
            setSuccess("Usuario registrado correctamente. Confirme su cuenta desde el correo electrónico")
        }
        catch (error: any) {
            if (error.response?.data?.message) {
                setErrorResponse(error.response.data.message)
                reset()
            }
        }
    }

    const fieldClasses = "w-full rounded-xl border border-white/10 bg-[#120A0C] px-4 py-3 text-[#F2EDE6] placeholder:text-[#C9BFB5]/35 transition-all duration-200 focus:border-[#9B2335] focus:outline-none focus:shadow-[0_0_0_3px_rgba(155,35,53,0.18)]"
    const labelClasses = "block text-[#C9BFB5] text-xs tracking-[0.2em] uppercase font-mono mb-2"
    const errorClasses = "flex items-center gap-1.5 text-[#C9405A] text-xs mt-2"

    return (
        <section className="min-h-screen bg-[#0A0A0A]">
            <Header />

            <div className="relative overflow-hidden border-b border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]">
                <DiagonalLines />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:px-10 md:py-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="h-0.5 w-12 bg-[#9B2335] shadow-[0_0_12px_rgba(155,35,53,0.8)]" />
                        <span className="text-[#9B2335] text-xs tracking-[0.3em] uppercase font-mono font-semibold">Registro</span>
                    </div>

                    <h1 className="text-[#F2EDE6] text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
                        Creá tu cuenta y <span className="text-[#C9405A] [text-shadow:0_0_28px_rgba(155,35,53,0.6)]">empezá a pedir</span>
                    </h1>

                    <p className="text-[#C9BFB5]/70 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
                        Completá tus datos para registrarte. Con tu cuenta vas a poder armar el carrito,
                        confirmar pedidos y seguir su estado hasta la entrega.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 md:px-10 md:py-20">
                <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] p-6 md:p-10">
                    <i className="bi bi-person-badge absolute -bottom-8 -right-6 text-[#9B2335]/10 text-[10rem] -rotate-12" aria-hidden="true" />

                    {success ? (
                        <div className="relative z-10 flex flex-col items-center text-center gap-4 py-10">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#9B2335]/15 border border-[#9B2335]/40">
                                <i className="bi bi-check-lg text-[#C9405A] text-3xl" aria-hidden="true" />
                            </div>
                            <h2 className="text-[#F2EDE6] text-2xl font-bold tracking-tight">¡Cuenta creada!</h2>
                            <p className="text-[#C9BFB5]/70 text-base max-w-md leading-relaxed">{success}</p>
                            <Link
                                to="/ingreso"
                                className="mt-2 flex items-center gap-2 bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
                            >
                                <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
                                Ir a iniciar sesión
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(submitForm)} className="relative z-10 space-y-10">

                            {errorResponse && (
                                <div className="flex items-center gap-3 rounded-xl border border-[#9B2335]/40 bg-[#9B2335]/10 px-4 py-3">
                                    <i className="bi bi-exclamation-triangle text-[#C9405A] text-lg shrink-0" aria-hidden="true" />
                                    <p className="text-[#F2EDE6] text-sm">{errorResponse}</p>
                                </div>
                            )}

                            {/* Datos personales */}
                            <div>
                                <div className="flex items-center gap-2 mb-5">
                                    <i className="bi bi-person text-[#9B2335] text-sm" aria-hidden="true" />
                                    <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Datos personales</span>
                                    <span className="flex-1 h-px bg-white/8 ml-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className={labelClasses}>Nombre</label>
                                        <input id="firstName" type="text" placeholder="Tu nombre" className={fieldClasses} {...register("firstName")} />
                                        {errors.firstName && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className={labelClasses}>Apellido</label>
                                        <input id="lastName" type="text" placeholder="Tu apellido" className={fieldClasses} {...register("lastName")} />
                                        {errors.lastName && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="dni" className={labelClasses}>DNI</label>
                                        <input id="dni" type="text" inputMode="numeric" placeholder="12345678" className={fieldClasses} {...register("dni")} />
                                        {errors.dni && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.dni.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className={labelClasses}>Teléfono</label>
                                        <input id="phone" type="tel" placeholder="+54 9 000 000 0000" className={fieldClasses} {...register("phone")} />
                                        {errors.phone && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-5">
                                    <i className="bi bi-shield-lock text-[#9B2335] text-sm" aria-hidden="true" />
                                    <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Datos de acceso</span>
                                    <span className="flex-1 h-px bg-white/8 ml-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className={labelClasses}>Email</label>
                                        <input id="email" type="email" placeholder="tucorreo@ejemplo.com" className={fieldClasses} {...register("email")} />
                                        {errors.email && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className={labelClasses}>Contraseña</label>
                                        <input id="password" type="password" placeholder="Mínimo 8 caracteres" className={fieldClasses} {...register("password")} />
                                        {errors.password && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-5">
                                    <i className="bi bi-geo-alt text-[#9B2335] text-sm" aria-hidden="true" />
                                    <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Domicilio de entrega</span>
                                    <span className="flex-1 h-px bg-white/8 ml-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                                    <div className="md:col-span-4">
                                        <label htmlFor="street" className={labelClasses}>Calle</label>
                                        <input id="street" type="text" placeholder="Nombre de la calle" className={fieldClasses} {...register("address.street")} />
                                        {errors.address?.street && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.address.street.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="number" className={labelClasses}>Número</label>
                                        <input id="number" type="text" placeholder="1234" className={fieldClasses} {...register("address.number")} />
                                        {errors.address?.number && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.address.number.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-3">
                                        <label htmlFor="floor" className={labelClasses}>
                                            Piso <span className="text-[#C9BFB5]/40 normal-case tracking-normal">(opcional)</span>
                                        </label>
                                        <input id="floor" type="text" placeholder="Ej: 3" className={fieldClasses} {...register("address.floor")} />
                                    </div>

                                    <div className="md:col-span-3">
                                        <label htmlFor="apartment" className={labelClasses}>
                                            Depto <span className="text-[#C9BFB5]/40 normal-case tracking-normal">(opcional)</span>
                                        </label>
                                        <input id="apartment" type="text" placeholder="Ej: B" className={fieldClasses} {...register("address.apartment")} />
                                    </div>

                                    <div className="md:col-span-3">
                                        <label htmlFor="city" className={labelClasses}>Localidad</label>
                                        <input id="city" type="text" placeholder="Tu localidad" className={fieldClasses} {...register("address.city")} />
                                        {errors.address?.city && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.address.city.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-3">
                                        <label htmlFor="province" className={labelClasses}>Provincia</label>
                                        <input id="province" type="text" placeholder="Tu provincia" className={fieldClasses} {...register("address.province")} />
                                        {errors.address?.province && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.address.province.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-white/8">
                                <p className="text-[#C9BFB5]/60 text-sm">
                                    ¿Ya tenés cuenta?{" "}
                                    <Link to="/ingreso" className="text-[#C9405A] font-semibold hover:text-[#F2EDE6] transition-colors duration-200">
                                        Iniciá sesión
                                    </Link>
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading.registerUser}
                                    className="flex cursor-pointer items-center justify-center gap-2 w-full sm:w-auto bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    {loading.registerUser ? "Creando cuenta..." : "Crear cuenta"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Register
