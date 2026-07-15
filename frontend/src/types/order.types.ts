import { z } from "zod"
import { orderSchema, orderAdminSchema, createOrderSchema, updateOrderStatusSchema } from "../../../shared"

export type Order = z.infer<typeof orderSchema>

// Pedido con los datos del cliente, para la vista del panel admin.
export type OrderAdmin = z.infer<typeof orderAdminSchema>

// Payload que envía el admin al cambiar el estado de un pedido.
export type UpdateOrderStatusInput = z.input<typeof updateOrderStatusSchema>

// z.input: lo que se arma en el front antes de enviar (quantity puede venir como string por coerce)
export type CreateOrderInput = z.input<typeof createOrderSchema>

export type OrdersLoading = {
  get: boolean
  create: boolean
  cancel: boolean
  pay: boolean
}

