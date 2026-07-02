import { useForm } from "react-hook-form";
import Header from "../components/ui/Header";
import DiagonalLines from "../components/ui/DiagonalLines";
import ContactItem from "../components/ui/ContactItem";
import { sendContactEmailService } from "../services/contact.service";
import type { ContactData } from "../types/general.types";
import Swal from "sweetalert2";

const Contact = () => {

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactData>();

    async function formSubmit(data: ContactData) {
        try {
            await sendContactEmailService(data);
            Swal.fire({
                icon: "success",
                title: "¡Mensaje enviado!",
                text: "Gracias por escribirnos. Te responderemos a la brevedad.",
                background: "#0F0507",
                color: "#F2EDE6",
                iconColor: "#9B2335",
                confirmButtonText: "Perfecto",
                confirmButtonColor: "#872F31",
            });
            reset();
        } catch (error) {
            console.error(error);
        }
    }

    const fieldClasses = "w-full rounded-xl border border-white/10 bg-[#120A0C] px-4 py-3 text-[#F2EDE6] placeholder:text-[#C9BFB5]/35 transition-all duration-200 focus:border-[#9B2335] focus:outline-none focus:shadow-[0_0_0_3px_rgba(155,35,53,0.18)]";
    const labelClasses = "block text-[#C9BFB5] text-xs tracking-[0.2em] uppercase font-mono mb-2";
    const errorClasses = "flex items-center gap-1.5 text-[#C9405A] text-xs mt-2";

    return (
        <section className="min-h-screen bg-[#0A0A0A]">
            <Header />

            <div className="relative overflow-hidden border-b border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A]">
                <DiagonalLines />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:px-10 md:py-24">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="h-0.5 w-12 bg-[#9B2335] shadow-[0_0_12px_rgba(155,35,53,0.8)]" />
                        <span className="text-[#9B2335] text-xs tracking-[0.3em] uppercase font-mono font-semibold">Contacto</span>
                    </div>

                    <h1 className="text-[#F2EDE6] text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-3xl">
                        Hablemos de <span className="text-[#C9405A] [text-shadow:0_0_28px_rgba(155,35,53,0.6)]">tu próximo pedido</span>
                    </h1>

                    <p className="text-[#C9BFB5]/70 text-base md:text-lg mt-6 max-w-2xl leading-relaxed">
                        ¿Tenés una consulta, querés hacer un pedido mayorista o necesitás asesoramiento sobre nuestros
                        cortes? Escribinos y te respondemos a la brevedad.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 md:px-10 md:py-20">
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 md:gap-16">

                    <div className="xl:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <i className="bi bi-headset text-[#9B2335] text-sm" aria-hidden="true" />
                            <span className="text-[#C9BFB5] text-xs tracking-[0.3em] uppercase font-mono">Estamos para ayudarte</span>
                        </div>

                        <h2 className="text-[#F2EDE6] text-2xl md:text-3xl font-bold tracking-tight mb-6">
                            Otras formas de encontrarnos
                        </h2>

                        <div className="space-y-6">
                            <ContactItem
                                icon="bi bi-telephone"
                                label="Teléfono"
                                value="+54 9 000 000 0000"
                            />
                            <ContactItem
                                icon="bi bi-envelope"
                                label="Email"
                                value="contacto@frigorifico5estrellas.com"
                            />
                            <ContactItem
                                icon="bi bi-geo-alt"
                                label="Ubicación"
                                value="Argentina"
                            />
                        </div>
                    </div>

                    <div className="xl:col-span-3">
                        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-[#1C0A0E] via-[#0F0507] to-[#0A0A0A] p-6 md:p-10">
                            <i className="bi bi-chat-dots absolute -bottom-8 -right-6 text-[#9B2335]/10 text-[10rem] -rotate-12" aria-hidden="true" />

                            <form onSubmit={handleSubmit(formSubmit)} className="relative z-10 space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className={labelClasses}>Nombre</label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Tu nombre"
                                            className={fieldClasses}
                                            {...register("name", { required: "El nombre es obligatorio" })}
                                        />
                                        {errors.name && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="surname" className={labelClasses}>Apellido</label>
                                        <input
                                            id="surname"
                                            type="text"
                                            placeholder="Tu apellido"
                                            className={fieldClasses}
                                            {...register("surname", { required: "El apellido es obligatorio" })}
                                        />
                                        {errors.surname && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.surname.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className={labelClasses}>Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="tucorreo@ejemplo.com"
                                            className={fieldClasses}
                                            {...register("email", {
                                                required: "El email es obligatorio",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Ingresá un email válido"
                                                }
                                            })}
                                        />
                                        {errors.email && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="number" className={labelClasses}>Teléfono</label>
                                        <input
                                            id="number"
                                            type="tel"
                                            placeholder="+54 9 000 000 0000"
                                            className={fieldClasses}
                                            {...register("number", { required: "El teléfono es obligatorio" })}
                                        />
                                        {errors.number && (
                                            <p className={errorClasses}>
                                                <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                                {errors.number.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className={labelClasses}>Mensaje</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        placeholder="Contanos en qué podemos ayudarte..."
                                        className={`${fieldClasses} resize-none`}
                                        {...register("message", { required: "El mensaje es obligatorio" })}
                                    />
                                    {errors.message && (
                                        <p className={errorClasses}>
                                            <i className="bi bi-exclamation-circle" aria-hidden="true" />
                                            {errors.message.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex cursor-pointer items-center justify-center gap-2 w-full md:w-auto bg-[#872F31] text-[#F2EDE6] text-sm font-semibold tracking-wide px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[#9B2335] hover:shadow-[0_0_24px_-4px_rgba(155,35,53,0.7)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Contact
