// La fecha de entrega es un día sin hora: se guarda como medianoche UTC y se lee
// año/mes/día tal cual viene. No se delega el parseo a `new Date(string)` porque
// ahí un "01/08/2026" se interpreta como mm/dd (formato de EE.UU.) y el 1 de agosto
// termina impreso como 8 de enero.

// "2026-08-01" (el value del <input type="date">) y el ISO que devuelve Mongo.
const ISO_DATE = /^(\d{4})-(\d{1,2})-(\d{1,2})/
// "01/08/2026" o "1-8-2026": en es-AR el día va primero, nunca el mes.
const SLASHED_DATE = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/

// Devuelve la fecha en medianoche UTC, o null si el valor no es una fecha usable.
export const parseDeliveryDate = (value: string | null | undefined): Date | null => {
  if (!value) return null

  const iso = ISO_DATE.exec(value)
  if (iso) {
    const [, year, month, day] = iso
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  }

  const slashed = SLASHED_DATE.exec(value)
  if (slashed) {
    const [, day, month, year] = slashed
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  }

  const fallback = new Date(value)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

// Fecha larga para el panel y la comanda: "sábado, 01 de agosto de 2026". Se formatea
// en UTC para que no se corra un día según la zona horaria del navegador.
export const formatDeliveryDate = (
  value: string | null | undefined,
  options?: { withYear?: boolean },
): string | null => {
  const date = parseDeliveryDate(value)
  if (!date) return null

  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    ...(options?.withYear === false ? {} : { year: 'numeric' as const }),
    timeZone: 'UTC',
  })
}
