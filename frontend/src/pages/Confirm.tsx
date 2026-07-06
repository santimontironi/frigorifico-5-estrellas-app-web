import { Link, useParams } from "react-router-dom"
import UseAuth from "../hooks/UseAuth"
import { useEffect, useState } from "react"
import DiagonalLines from "../components/ui/DiagonalLines"

const Confirm = () => {

    const { loading, confirmUser } = UseAuth()

    const [success, setSuccess] = useState<null | string>(null)

    const [errorResponse, setErrorResponse] = useState<string | null>(null)

    const { token } = useParams<{ token: string }>();

    useEffect(() => {

        async function handleConfirm() {
            if (!token) {
                setErrorResponse("No se proporcionó el token")
                return
            }

            try {
                setErrorResponse(null)
                await confirmUser(token)
                setSuccess("Tu cuenta fue confirmada correctamente. Ya podés iniciar sesión y empezar a pedir.")
            }
            catch (error: any) {
                setErrorResponse(error.response?.data?.message ?? "No pudimos confirmar tu cuenta. El enlace puede haber expirado o ser inválido.")
            }
        }

        handleConfirm()
    }, [token])

    const isLoading = loading.confirmUser && !success && !errorResponse

    return (
        <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] flex items-center justify-center px-6 py-16">
            <DiagonalLines />

            <div className="relative z-10 w-full max-w-md">
                <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0F0507]/80 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 md:p-10 text-center">

                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="h-0.5 w-10 bg-[#9B2335] shadow-[0_0_12px_rgba(155,35,53,0.8)]" />
                        <span className="text-[#9B2335] text-xs tracking-[0.3em] uppercase font-mono font-semibold">Frigorífico 5 Estrellas</span>
                    </div>

                    {isLoading && (
                        <div className="flex flex-col items-center gap-6 py-6">
                            <i className="bi bi-arrow-repeat text-[#C9405A] text-5xl animate-spin" aria-hidden="true" />
                            <div>
                                <h1 className="text-[#F2EDE6] text-2xl font-bold tracking-tight">Confirmando tu cuenta</h1>
                                <p className="text-[#C9BFB5]/70 text-sm mt-2 leading-relaxed">Estamos validando tu enlace, esperá un instante...</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="flex flex-col items-center gap-5 py-4">
                            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#9B2335]/15 border border-[#9B2335]/40">
                                <i className="bi bi-check-lg text-[#C9405A] text-4xl" aria-hidden="true" />
                            </div>
                            <div>
                                <h1 className="text-[#F2EDE6] text-2xl font-bold tracking-tight">¡Cuenta confirmada!</h1>
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
                    )}

                    {errorResponse && (
                        <div className="flex flex-col items-center gap-5 py-4">
                            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#9B2335]/10 border border-[#9B2335]/30">
                                <i className="bi bi-exclamation-triangle text-[#C9405A] text-4xl" aria-hidden="true" />
                            </div>
                            <div>
                                <h1 className="text-[#F2EDE6] text-2xl font-bold tracking-tight">No pudimos confirmar</h1>
                                <p className="text-[#C9BFB5]/70 text-sm mt-2 leading-relaxed max-w-xs mx-auto">{errorResponse}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
                                <Link
                                    to="/registro"
                                    className="flex items-center justify-center gap-2 flex-1 bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-6 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98]"
                                >
                                    <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                                    Volver a registrarme
                                </Link>
                                <Link
                                    to="/"
                                    className="flex items-center justify-center gap-2 flex-1 border border-white/15 text-[#C9BFB5] text-sm font-semibold tracking-wide px-6 py-3.5 rounded-xl transition-all duration-200 hover:border-[#9B2335] hover:text-[#F2EDE6] active:scale-[0.98]"
                                >
                                    <i className="bi bi-house" aria-hidden="true" />
                                    Ir al inicio
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </main>
    )
}

export default Confirm
