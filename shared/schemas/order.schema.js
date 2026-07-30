import { z } from "zod";

export const deliveryAddressSchema = z.object({
  street: z.string().trim().min(1, "La calle es obligatoria"),
  number: z.string().trim().min(1, "El número es obligatorio"),
  floor: z.string().trim().optional(),
  apartment: z.string().trim().optional(),
  city: z.string().trim().min(1, "La ciudad es obligatoria"),
  province: z.string().trim().min(1, "La provincia es obligatoria"),
});

export const createOrderItemSchema = z.object({
  product: z.string().trim().min(1, "El producto es obligatorio"),
  quantity: z.coerce.number().min(0.1, "La cantidad debe ser mayor a 0"),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1, "El pedido debe tener al menos un producto"),
  notesUser: z.string().trim().optional(),
});

// El pago es en el local: "paid" lo registra el admin/empleado al cobrar.
export const updateOrderStatusSchema = z.object({
  status: z.enum(["in_preparation", "rejected", "paid", "delivered"]),
  rejectionReason: z.string().trim().optional(),
  finalAmount: z.coerce.number().min(0, "El monto debe ser mayor o igual a 0").optional(),
  // Fecha de entrega: el front la manda como "yyyy-mm-dd" y se coerce a Date.
  deliveryDate: z.coerce.date({ message: "La fecha de entrega no es válida" }).optional(),
  // Indicaciones internas: se imprimen en la comanda del carnicero.
  adminNotesForButcher: z.string().trim().optional(),
  // Mensaje para el cliente: se le manda en el mail de "en preparación".
  adminNotesForUser: z.string().trim().optional(),
}).refine(
  // Al aceptar el pedido la fecha de entrega es obligatoria: es el dato con el que
  // el cliente sabe cuándo pasar a retirarlo.
  (data) => data.status !== "in_preparation" || data.deliveryDate !== undefined,
  { message: "La fecha de entrega es obligatoria al aceptar el pedido", path: ["deliveryDate"] },
);

export const orderItemSchema = z.object({
  _id: z.string(),
  product: z.string(),
  nameSnapshot: z.string(),
  priceSnapshot: z.number(),
  unitSnapshot: z.enum(["kg", "unit"]),
  quantity: z.number(),
  subtotal: z.number(),
});

export const orderSchema = z.object({
  _id: z.string(),
  user: z.string(),
  items: z.array(orderItemSchema),
  approximateTotal: z.number(),
  finalAmount: z.number().nullable(),
  status: z.enum([
    "pending",
    "rejected",
    "paid",
    "in_preparation",
    "delivered",
    "canceled",
  ]),
  rejectionReason: z.string().optional(),
  // Llega como ISO string; null mientras el pedido no fue aceptado.
  deliveryDate: z.string().nullable().optional(),
  deliveryAddress: deliveryAddressSchema,
  notesUser: z.string().optional(),
  adminNotesForButcher: z.string().optional(),
  adminNotesForUser: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createOrderResponse = z.object({
  message: z.string(),
  order: orderSchema,
});

export const getOrdersResponse = z.object({
  orders: z.array(orderSchema),
});

export const cancelOrderResponse = z.object({
  message: z.string(),
  order: orderSchema,
});

export const orderAdminSchema = orderSchema.extend({
  user: z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    // Opcional por defensa: si un cliente viejo no lo tiene, no rompe el listado.
    dni: z.string().optional(),
    email: z.string(),
    phone: z.string(),
  }),
});

export const getAllOrdersResponse = z.object({
  orders: z.array(orderAdminSchema),
});

export const updateOrderResponse = z.object({
  message: z.string(),
  order: orderAdminSchema,
});
