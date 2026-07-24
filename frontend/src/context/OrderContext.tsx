import { createContext, useState } from "react"
import type { Order, OrdersLoading, CreateOrderInput } from "../types/order.types"
import { getOrdersService, createOrderService, cancelOrderService, payOrderService, confirmPaymentService } from "../services/order.service"

type OrderContextType = {
  orders: Order[]
  ordersFiltered: Order[]
  loading: OrdersLoading
  getOrders: () => Promise<void>
  createOrder: (data: CreateOrderInput) => Promise<Order>
  cancelOrder: (id: string) => Promise<void>
  payOrder: (id: string) => Promise<string>
  confirmPayment: (paymentId: string) => Promise<void>
  getOrdersByStatus: (status: string) => void
}

export const OrderContext = createContext<OrderContextType | null>(null)

export const OrderContextProvider = ({ children }: any) => {
  const [orders, setOrders] = useState<Order[]>([])

  const [ordersFiltered, setOrdersFiltered] = useState<Order[]>([])

  const [loading, setLoading] = useState<OrdersLoading>({
    get: false,
    create: false,
    cancel: false,
    pay: false,
    confirm: false,
  })

  const getOrders = async () => {
    setLoading(prev => ({ ...prev, get: true }))
    try {
      const res = await getOrdersService()
      setOrders(res.orders)
    } catch (err) {
      console.error(err)
      setOrders([])
    } finally {
      setLoading(prev => ({ ...prev, get: false }))
    }
  }

  const createOrder = async (data: CreateOrderInput) => {
    setLoading(prev => ({ ...prev, create: true }))
    try {
      const res = await createOrderService(data)
      // Prepend: el pedido recién creado queda primero (mismo orden que el back, createdAt desc)
      setOrders(prev => [res.order, ...prev])
      return res.order
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading(prev => ({ ...prev, create: false }))
    }
  }

  const cancelOrder = async (id: string) => {
    setLoading(prev => ({ ...prev, cancel: true }))
    try {
      await cancelOrderService(id)
      // El back excluye los cancelados de los listados: lo quitamos de la lista.
      setOrders(prev => prev.filter(order => order._id !== id))
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading(prev => ({ ...prev, cancel: false }))
    }
  }

  const payOrder = async (id: string) => {
    setLoading(prev => ({ ...prev, pay: true }))
    try {
      const res = await payOrderService(id)
      // Devolvemos el init_point para que el componente redirija al checkout de MP.
      return res.init_point
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading(prev => ({ ...prev, pay: false }))
    }
  }

  const confirmPayment = async (paymentId: string) => {
    setLoading(prev => ({ ...prev, confirm: true }))
    try {
      await confirmPaymentService(paymentId)
      // Releemos los pedidos para que "Mis pedidos" ya muestre el estado "Pagado".
      await getOrders()
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      setLoading(prev => ({ ...prev, confirm: false }))
    }
  }

  // Filtra los pedidos por estado. "" = todos. Guarda el resultado en ordersFiltered.
  const getOrdersByStatus = (status: string) => {
    setOrdersFiltered(status ? orders.filter(order => order.status === status) : orders)
  }

  return (
    <OrderContext.Provider value={{ orders, ordersFiltered, loading, getOrders, createOrder, cancelOrder, payOrder, confirmPayment, getOrdersByStatus }}>
      {children}
    </OrderContext.Provider>
  )
}
