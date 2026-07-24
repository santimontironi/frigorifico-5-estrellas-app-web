import api from "./api"
import { getOrdersResponse, createOrderResponse, cancelOrderResponse, getAllOrdersResponse, payOrderResponse, updateOrderResponse, confirmPaymentResponse } from "../../../shared"
import type { CreateOrderInput, UpdateOrderStatusInput } from "../types/order.types"

export const getOrdersService = async () => {
  const res = await api.get("/orders")
  return getOrdersResponse.parse(res.data)
}

export const getAllOrdersService = async () => {
  const res = await api.get("/orders/all")
  return getAllOrdersResponse.parse(res.data)
}

export const updateOrderStatusService = async (id: string, data: UpdateOrderStatusInput) => {
  const res = await api.patch(`/orders/${id}/status`, data)
  return updateOrderResponse.parse(res.data)
}

export const createOrderService = async (data: CreateOrderInput) => {
  const res = await api.post("/orders", data)
  return createOrderResponse.parse(res.data)
}

export const cancelOrderService = async (id: string) => {
  const res = await api.patch(`/orders/${id}/cancel`)
  return cancelOrderResponse.parse(res.data)
}

export const payOrderService = async (id: string) => {
  const res = await api.post(`/orders/${id}/pay`)
  return payOrderResponse.parse(res.data)
}

// Al volver del checkout de Mercado Pago confirmamos el pago con el payment_id
// que viene en la URL, para que el pedido pase a "paid" sin depender del webhook.
export const confirmPaymentService = async (paymentId: string) => {
  const res = await api.post("/orders/payment/confirm", { paymentId })
  return confirmPaymentResponse.parse(res.data)
}
