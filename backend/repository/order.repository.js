import Order from "../models/order.model.js";
import OrderItem from "../models/orderItem.model.js";

class OrderRepository {
  // Los OrderItem se crean primero para poder referenciar sus _id en el Order.
  async createOrderItems(items) {
    return await OrderItem.insertMany(items);
  }

  async createOrder(data) {
    return await Order.create(data);
  }

  async getOrderById(id) {
    return await Order.findById(id).populate("items");
  }

  async getOrdersByUser(userId) {
    // Todos los estados menos los cancelados: el cliente no ve sus pedidos cancelados.
    return await Order.find({ user: userId, status: { $ne: "canceled" } })
      .sort({ createdAt: -1 })
      .populate("items");
  }

  async getAllOrders() {
    // Vista admin: todos los pedidos, con los items y los datos del cliente.
    return await Order.find()
      .sort({ createdAt: -1 })
      .populate("items")
      .populate({ path: "user", select: "firstName lastName email phone" });
  }

  async updateOrder(id, data) {
    // Devuelve el pedido con el mismo formato que la vista admin (items + cliente).
    return await Order.findByIdAndUpdate(id, data, { returnDocument: "after" })
      .populate("items")
      .populate({ path: "user", select: "firstName lastName email phone" });
  }

  async cancelOrder(id) {
    return await Order.findByIdAndUpdate(
      id,
      { status: "canceled" },
      { returnDocument: "after" },
    ).populate("items");
  }

  async setOrderPreference(id, preferenceId) {
    return await Order.findByIdAndUpdate(
      id,
      { "mercadoPagoPayment.preferenceId": preferenceId },
      { returnDocument: "after" },
    );
  }

  async markOrderAsPaid(id, paymentId) {
    return await Order.findByIdAndUpdate(
      id,
      {
        status: "paid",
        "mercadoPagoPayment.paymentId": paymentId,
        "mercadoPagoPayment.status": "approved",
      },
      { returnDocument: "after" },
    )
      .populate("items")
      .populate({ path: "user", select: "firstName lastName email phone" });
  }
}

const orderRepository = new OrderRepository();
export default orderRepository;
