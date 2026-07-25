import transporter from "../config/mail.config.js";

const formatPrice = (value) => `$${Number(value).toLocaleString("es-AR")}`;

// Referencia legible del pedido: últimos 6 caracteres del _id.
const shortId = (id) => id.toString().slice(-6).toUpperCase();

// Fecha de entrega en formato largo. Se guarda como fecha sin hora (medianoche UTC),
// así que se formatea en UTC para que no se corra un día por la zona horaria.
const formatDeliveryDate = (date) =>
  new Date(date).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

// Bloque destacado con la fecha en la que el pedido queda listo para retirar.
const deliveryDateBlock = (order) =>
  order.deliveryDate
    ? `<div style="background:#F7F4F1;border-left:4px solid #9B2335;border-radius:6px;padding:14px 16px;margin:20px 0;">
        <p style="margin:0;font-size:15px;color:#1C1714;">
          <strong>Fecha de entrega:</strong> ${formatDeliveryDate(order.deliveryDate)}
        </p>
        <p style="margin:6px 0 0;font-size:13px;color:#7A6B63;">Ese día podés pasar por el local a pagarlo y retirarlo.</p>
      </div>`
    : "";

// Filas de la tabla de items a partir de los snapshots del pedido.
const itemsRows = (items) =>
  items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.nameSnapshot}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity} ${item.unitSnapshot === "kg" ? "kg" : "un"}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.subtotal)}</td>
        </tr>`,
    )
    .join("");

// Tabla de items reutilizada en varios mails.
const itemsTable = (items) => `
  <table style="width:100%;border-collapse:collapse;margin:20px 0;">
    <thead>
      <tr style="text-align:left;color:#7A6B63;font-size:13px;">
        <th style="padding-bottom:8px;">Producto</th>
        <th style="padding-bottom:8px;text-align:center;">Cantidad</th>
        <th style="padding-bottom:8px;text-align:right;">Subtotal</th>
      </tr>
    </thead>
    <tbody>${itemsRows(items)}</tbody>
  </table>`;

// Domicilio del cliente en una línea. Con la modalidad de retiro en el local no es
// una dirección de entrega: va en los avisos internos como dato del cliente.
const addressLine = (order) => {
  const a = order.deliveryAddress;
  return `${a.street} ${a.number}${a.floor ? `, Piso ${a.floor}` : ""}${a.apartment ? `, Depto ${a.apartment}` : ""} — ${a.city}, ${a.province}`;
};

// Datos de contacto del cliente, para los avisos internos al frigorífico.
const customerBlock = (user, order) => `
  <div style="background:#F7F4F1;border-radius:8px;padding:16px;font-size:14px;color:#1C1714;">
    <p style="margin:0 0 6px;"><strong>Cliente:</strong> ${user.firstName} ${user.lastName || ""}</p>
    <p style="margin:0 0 6px;"><strong>DNI:</strong> ${user.dni || "—"}</p>
    <p style="margin:0 0 6px;"><strong>Email:</strong> ${user.email}</p>
    <p style="margin:0 0 6px;"><strong>Teléfono:</strong> ${user.phone || "—"}</p>
    <p style="margin:0;"><strong>Domicilio:</strong> ${addressLine(order)}</p>
  </div>`;

// Aviso de la modalidad vigente: el cliente paga y retira en el local.
const pickupNote = `
  <p style="font-size:13px;color:#7A6B63;">
    <strong>Pago y retiro en el local:</strong> cuando tu pedido esté listo lo abonás y lo retirás en el frigorífico. Por ahora no hacemos envíos a domicilio.
  </p>`;

// Mail de confirmación cuando el usuario crea un pedido (al cliente + al frigorífico).
export async function sendOrderCreatedMail(user, order) {
  // 1) Al cliente
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Recibimos tu pedido #${shortId(order._id)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1714;">
        <h2 style="color:#9B2335;">¡Gracias por tu pedido, ${user.firstName}!</h2>
        <p>Recibimos tu pedido <strong>#${shortId(order._id)}</strong> y ya está <strong>pendiente de confirmación</strong>. Te vamos a avisar cuando lo aceptemos y cuando esté listo para que pases a pagarlo y retirarlo.</p>
        ${itemsTable(order.items)}
        <p style="text-align:right;font-size:18px;"><strong>Total aproximado: ${formatPrice(order.approximateTotal)}</strong></p>
        <p style="color:#7A6B63;font-size:13px;">Los cortes por kilo se pesan al preparar el pedido, por eso el total es aproximado. El monto final lo confirmamos antes de que pagues.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        ${pickupNote}
      </div>`,
  });

  // 2) Al frigorífico (aviso interno a sí mismo)
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Nuevo pedido #${shortId(order._id)} — ${user.firstName} ${user.lastName || ""}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1714;">
        <h2 style="color:#9B2335;">Nuevo pedido recibido</h2>
        <p>Ingresó el pedido <strong>#${shortId(order._id)}</strong>, pendiente de confirmación.</p>
        ${customerBlock(user, order)}
        ${itemsTable(order.items)}
        <p style="text-align:right;font-size:18px;"><strong>Total aproximado: ${formatPrice(order.approximateTotal)}</strong></p>
        ${order.notesUser ? `<p style="color:#7A6B63;font-size:13px;"><strong>Notas del cliente:</strong> ${order.notesUser}</p>` : ""}
      </div>`,
  });
}

// Mail de confirmación cuando el usuario cancela un pedido (al cliente + al frigorífico).
export async function sendOrderCanceledMail(user, order) {
  // 1) Al cliente
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Cancelaste tu pedido #${shortId(order._id)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1714;">
        <h2 style="color:#9B2335;">Pedido cancelado</h2>
        <p>Hola ${user.firstName}, confirmamos que tu pedido <strong>#${shortId(order._id)}</strong> fue <strong>cancelado</strong> correctamente.</p>
        <p style="color:#7A6B63;">Si fue un error o querés volver a pedir, podés armar un nuevo pedido cuando quieras desde la web.</p>
      </div>`,
  });

  // 2) Al frigorífico (aviso interno)
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Pedido cancelado #${shortId(order._id)} — ${user.firstName} ${user.lastName || ""}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1714;">
        <h2 style="color:#9B2335;">Pedido cancelado por el cliente</h2>
        <p>El cliente canceló el pedido <strong>#${shortId(order._id)}</strong>.</p>
        ${customerBlock(user, order)}
      </div>`,
  });
}

// Comprobante para el cliente cuando el frigorífico registra el cobro en el local.
// Solo va al cliente: el aviso interno no hace falta porque el cobro lo registra
// el propio frigorífico desde el panel.
export async function sendOrderPaidMail(user, order) {
  const amount = order.finalAmount ?? order.approximateTotal;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Registramos el pago de tu pedido #${shortId(order._id)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1714;">
        <h2 style="color:#9B2335;">¡Pago registrado!</h2>
        <p>Hola ${user.firstName}, registramos el pago de tu pedido <strong>#${shortId(order._id)}</strong> en el local. ¡Gracias!</p>
        ${itemsTable(order.items)}
        <p style="text-align:right;font-size:18px;"><strong>Total pagado: ${formatPrice(amount)}</strong></p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p style="font-size:13px;color:#7A6B63;">Este mail es tu comprobante del pedido. Si todavía no lo retiraste, podés pasar a buscarlo por el frigorífico.</p>
      </div>`,
  });
}

// Copy por estado para el mail al cliente cuando el admin cambia el estado.
const STATUS_MAIL = {
  in_preparation: {
    subject: "está en preparación",
    heading: "Tu pedido está en preparación",
    body: "Ya estamos preparando tu pedido. Lo pagás y lo retirás en el local en la fecha de entrega.",
  },
  rejected: {
    subject: "fue rechazado",
    heading: "Tu pedido fue rechazado",
    body: "Lamentablemente no pudimos tomar tu pedido.",
  },
  // "paid" no está acá: el cobro en el local tiene su propio mail (sendOrderPaidMail).
  delivered: {
    subject: "fue entregado",
    heading: "Tu pedido fue entregado",
    body: "Retiraste tu pedido. ¡Gracias por elegirnos!",
  },
};

// Mail al cliente cuando el admin cambia el estado del pedido.
export async function sendOrderStatusChangedMail(user, order) {
  const info = STATUS_MAIL[order.status];
  if (!info) return; // estado sin notificación definida

  const hasFinal = order.finalAmount !== null && order.finalAmount !== undefined;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Tu pedido #${shortId(order._id)} ${info.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1714;">
        <h2 style="color:#9B2335;">${info.heading}</h2>
        <p>Hola ${user.firstName}, tu pedido <strong>#${shortId(order._id)}</strong> ${info.subject}.</p>
        <p style="color:#7A6B63;">${info.body}</p>
        ${order.status === "rejected" && order.rejectionReason ? `<p style="color:#7A6B63;"><strong>Motivo:</strong> ${order.rejectionReason}</p>` : ""}
        ${order.status === "in_preparation" ? deliveryDateBlock(order) : ""}
        ${order.status === "in_preparation" && hasFinal ? `<p style="text-align:right;font-size:18px;"><strong>Total final: ${formatPrice(order.finalAmount)}</strong></p>` : ""}
      </div>`,
  });
}
