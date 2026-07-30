import type { OrderAdmin } from "../../../types/order.types"

const unitLabel = (unit: string) => (unit === 'kg' ? 'kg' : 'un')

// La cantidad puede venir con decimales (0.5 kg): se muestra sin ceros de relleno.
const formatQuantity = (value: number) => value.toLocaleString('es-AR', { maximumFractionDigits: 3 })

interface ComandaProps {
  order: OrderAdmin
  // Indicaciones y fecha tipeadas en el panel, todavía sin guardar. Van aparte del
  // pedido porque la comanda se puede imprimir antes de aceptarlo, y hasta ese momento
  // el server no tiene ninguno de los dos valores.
  notesForButcher?: string
  deliveryDate?: string
}

// Comanda de cocina para el carnicero: para quién es, qué armar y para cuándo. Sin
// precios ni datos de contacto del cliente (eso queda en el panel y en el mail), y en
// blanco y negro puro porque la térmica no imprime grises: los tramaría como suciedad.
const Comanda = ({ order, notesForButcher, deliveryDate }: ComandaProps) => {
  const shortId = order._id.slice(-6).toUpperCase()

  // Lo tipeado gana sobre lo guardado: si el admin lo acaba de escribir, es lo que
  // tiene que salir en el papel.
  const notes = notesForButcher?.trim() || order.adminNotesForButcher
  const delivery = deliveryDate || order.deliveryDate

  // Las dos formas de la fecha son medianoche UTC ("yyyy-mm-dd" del input y el ISO que
  // guarda Mongo), así que se formatean en UTC para que no se corra un día según la
  // zona horaria del navegador.
  const deliveryDateLabel = delivery
    ? new Date(delivery).toLocaleDateString('es-AR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC',
    })
    : null

  const orderDate = new Date(order.createdAt).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const printedAt = new Date().toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })


  return (
    // Ancho igual al PrintWidth del driver (72mm). El padding va adentro de esa medida
    // (border-box) para que ninguna letra quede pisada contra el borde del papel.
    <div className="w-[72mm] px-[2mm] bg-white text-black font-mono text-[12px] leading-snug">

      <div className="text-center pb-2">
        <p className="text-[17px] font-bold tracking-[0.2em]">COMANDA</p>
        <p className="text-[14px] font-bold mt-0.5">#{shortId}</p>
      </div>

      {/* Nombre para rotular la bolsa. El resto de los datos del cliente (DNI, teléfono,
          domicilio) no van al papel: quedan en el panel y en el mail interno. */}
      <div className="border-t border-dashed border-black pt-2 pb-2">
        <p className="text-[10px] font-bold tracking-[0.15em]">CLIENTE</p>
        <p className="text-[15px] font-bold uppercase mt-0.5 wrap-break-word">
          {order.user.firstName} {order.user.lastName}
        </p>
      </div>

      <div className="border-t border-dashed border-black pt-2 pb-2">
        <p className="text-[10px] font-bold tracking-[0.15em]">ENTREGA</p>
        {deliveryDateLabel ? (
          <p className="text-[14px] font-bold first-letter:uppercase mt-0.5">{deliveryDateLabel}</p>
        ) : (
          <p className="text-[14px] font-bold mt-0.5">SIN FECHA ASIGNADA</p>
        )}
      </div>

      <div className="border-t border-dashed border-black pt-2">
        <p className="text-[10px] font-bold tracking-[0.15em] pb-1">
          PRODUCTOS ({order.items.length})
        </p>
        <ul>
          {order.items.map((item) => (
            <li key={item._id} className="py-1.5 border-b border-dotted border-black/60 last:border-b-0">
              <p className="text-[14px] font-bold uppercase leading-tight">{item.nameSnapshot}</p>
              <p className="text-[13px] mt-0.5">
                Pedido: {formatQuantity(item.quantity)} {unitLabel(item.unitSnapshot)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Solo las indicaciones internas. Ni las notas del cliente ni el mensaje que el
          admin le manda por mail (adminNotesForUser) viajan a este papel. */}
      {notes && (
        <div className="border-t border-dashed border-black mt-2 pt-2">
          <p className="text-[10px] font-bold tracking-[0.15em]">INDICACIONES</p>
          <p className="text-[13px] font-bold mt-0.5 wrap-break-word">{notes}</p>
        </div>
      )}

      <div className="border-t border-dashed border-black mt-2 pt-2 pb-6 text-[10px]">
        <p>Pedido: {orderDate}</p>
        <p>Impresa: {printedAt}</p>
      </div>
    </div>
  )
}

export default Comanda
