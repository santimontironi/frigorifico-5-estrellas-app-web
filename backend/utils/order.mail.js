import transporter from "../config/mail.config.js";

const formatPrice = (value) => `$${Number(value).toLocaleString("es-AR")}`;

// Referencia legible del pedido: últimos 6 caracteres del _id.
const shortId = (id) => id.toString().slice(-6).toUpperCase();

// Dirección de entrega en una línea.
const addressLine = (order) => {
  const a = order.deliveryAddress;
  return `${a.street} ${a.number}${a.floor ? `, Piso ${a.floor}` : ""}${a.apartment ? `, Depto ${a.apartment}` : ""} — ${a.city}, ${a.province}`;
};

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

// Datos de contacto del cliente, para los avisos internos al frigorífico.
const customerBlock = (user, order) => `
  <div style="background:#F7F4F1;border-radius:8px;padding:16px;font-size:14px;color:#1C1714;">
    <p style="margin:0 0 6px;"><strong>Cliente:</strong> ${user.firstName} ${user.lastName || ""}</p>
    <p style="margin:0 0 6px;"><strong>Email:</strong> ${user.email}</p>
    <p style="margin:0 0 6px;"><strong>Teléfono:</strong> ${user.phone || "—"}</p>
    <p style="margin:0;"><strong>Entrega:</strong> ${addressLine(order)}</p>
  </div>`;

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
        <p>Recibimos tu pedido <strong>#${shortId(order._id)}</strong> y ya está <strong>pendiente de confirmación</strong>. Te vamos a avisar cuando lo aceptemos para coordinar el pago y la entrega.</p>
        ${itemsTable(order.items)}
        <p style="text-align:right;font-size:18px;"><strong>Total aproximado: ${formatPrice(order.approximateTotal)}</strong></p>
        <p style="color:#7A6B63;font-size:13px;">Los cortes por kilo se pesan al preparar el pedido, por eso el total es aproximado. El monto final lo confirmamos antes de que pagues.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p style="font-size:13px;color:#7A6B63;"><strong>Entrega en:</strong> ${addressLine(order)}</p>
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

// Mail cuando se aprueba el pago del pedido (al cliente + al frigorífico).
export async function sendOrderPaidMail(user, order) {
  const amount = order.finalAmount ?? order.approximateTotal;

  // 1) Al cliente
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Confirmamos el pago de tu pedido #${shortId(order._id)}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1714;">
        <h2 style="color:#9B2335;">¡Pago confirmado!</h2>
        <p>Hola ${user.firstName}, recibimos el pago de tu pedido <strong>#${shortId(order._id)}</strong>. ¡Gracias! Ya coordinamos la entrega.</p>
        ${itemsTable(order.items)}
        <p style="text-align:right;font-size:18px;"><strong>Total pagado: ${formatPrice(amount)}</strong></p>
        <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
        <p style="font-size:13px;color:#7A6B63;"><strong>Entrega en:</strong> ${addressLine(order)}</p>
      </div>`,
  });

  // 2) Al frigorífico (aviso interno)
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Pedido pagado #${shortId(order._id)} — ${user.firstName} ${user.lastName || ""}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1C1714;">
        <h2 style="color:#9B2335;">Pedido pagado</h2>
        <p>El cliente pagó el pedido <strong>#${shortId(order._id)}</strong>.</p>
        ${customerBlock(user, order)}
        ${itemsTable(order.items)}
        <p style="text-align:right;font-size:18px;"><strong>Total pagado: ${formatPrice(amount)}</strong></p>
      </div>`,
  });
}

// Copy por estado para el mail al cliente cuando el admin cambia el estado.
const STATUS_MAIL = {
  in_preparation: {
    subject: "está en preparación",
    heading: "Tu pedido está en preparación",
    body: "Ya estamos preparando tu pedido. Cuando esté listo vas a poder pagarlo desde tu panel.",
  },
  rejected: {
    subject: "fue rechazado",
    heading: "Tu pedido fue rechazado",
    body: "Lamentablemente no pudimos tomar tu pedido.",
  },
  paid: {
    subject: "fue pagado",
    heading: "Confirmamos el pago de tu pedido",
    body: "Recibimos el pago de tu pedido. ¡Gracias! Ya coordinamos la entrega.",
  },
  delivered: {
    subject: "fue entregado",
    heading: "Tu pedido fue entregado",
    body: "Tu pedido fue entregado. ¡Gracias por elegirnos!",
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
        ${order.status === "in_preparation" && hasFinal ? `<p style="text-align:right;font-size:18px;"><strong>Total final: ${formatPrice(order.finalAmount)}</strong></p>` : ""}
      </div>`,
  });
}
