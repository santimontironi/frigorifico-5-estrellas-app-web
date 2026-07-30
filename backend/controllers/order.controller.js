import orderRepository from "../repository/order.repository.js";
import productRepository from "../repository/product.repository.js";
import userRepository from "../repository/user.repository.js";
import { sendOrderCreatedMail, sendOrderCanceledMail, sendOrderStatusChangedMail, sendOrderPaidMail } from "../utils/order.mail.js";

class OrderController {
  async createOrder(req, res) {
    try {
      const userId = req.auth.id; // El usuario sale del token
      const { items, notesUser } = req.body;

      // La dirección de entrega se toma del usuario autenticado, no del body:
      // igual que los precios, es dato de confianza que resuelve el back.
      const user = await userRepository.findById(userId);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      // Armamos los snapshots contra la DB: precio, nombre y unidad se
      // congelan al momento del pedido y no dependen de lo que mande el front.
      const orderItemsData = [];

      for (const item of items) {
        const product = await productRepository.getProductById(item.product);

        if (!product) return res.status(404).json({ message: `Producto no encontrado: ${item.product}` });

        orderItemsData.push({
          product: product._id,
          nameSnapshot: product.name,
          priceSnapshot: product.price,
          unitSnapshot: product.unit,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        });
      }

      // Total aproximado: para productos por kg el peso real puede variar,
      // por eso finalAmount queda null hasta que el admin lo confirme.
      const approximateTotal = orderItemsData.reduce((acc, i) => acc + i.subtotal,0);

      const createdItems = await orderRepository.createOrderItems(orderItemsData);

      const newOrder = await orderRepository.createOrder({
        user: userId,
        items: createdItems.map((i) => i._id),
        approximateTotal,
        // Snapshot de la dirección: si el usuario la edita luego, este pedido
        // conserva la que tenía al momento de la compra.
        deliveryAddress: user.address,
        notesUser: notesUser || "",
      });

      const populatedOrder = await orderRepository.getOrderById(newOrder._id);

      // El mail es un "efecto secundario": si falla, el pedido igual se creó.
      try {
        await sendOrderCreatedMail(user, populatedOrder);
      } catch (mailError) {
        console.error("No se pudo enviar el mail de creación de pedido:", mailError.message);
      }

      return res.status(201).json({
        message: "Pedido creado correctamente",
        order: populatedOrder,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUserOrders(req, res) {
    try {
      const userId = req.auth.id;

      const orders = await orderRepository.getOrdersByUser(userId);

      if (orders.length === 0)
        return res.status(404).json({ message: "No tenés pedidos todavía" });

      return res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await orderRepository.getAllOrders();
      return res.status(200).json({ orders });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, rejectionReason, finalAmount, deliveryDate, adminNotesForButcher, adminNotesForUser } = req.body;

      const order = await orderRepository.getOrderById(id);
      if (!order)
        return res.status(404).json({ message: "Pedido no encontrado" });

      // Transiciones permitidas para el admin/empleado. El cobro es en el local:
      // "paid" lo registra el frigorífico cuando el cliente paga en el mostrador,
      // y solo se entrega un pedido ya cobrado.
      const allowedTransitions = {
        pending: ["in_preparation", "rejected"],
        in_preparation: ["paid"],
        paid: ["delivered"],
      };

      const allowed = allowedTransitions[order.status] || [];
      if (!allowed.includes(status))
        return res.status(400).json({ message: `No se puede pasar de "${order.status}" a "${status}"` });

      const data = { status };
      if (status === "rejected") data.rejectionReason = rejectionReason || "";
      if (finalAmount !== undefined) data.finalAmount = finalAmount;
      // La fecha de entrega solo se carga al aceptar el pedido (el schema la exige ahí).
      if (deliveryDate !== undefined) data.deliveryDate = deliveryDate;
      // Las dos notas del admin se cargan al aceptar: una se imprime en la comanda
      // y la otra viaja en el mail de "en preparación".
      if (adminNotesForButcher !== undefined) data.adminNotesForButcher = adminNotesForButcher;
      if (adminNotesForUser !== undefined) data.adminNotesForUser = adminNotesForUser;

      const updatedOrder = await orderRepository.updateOrder(id, data);

      // Aviso al cliente del cambio de estado (efecto secundario, no corta el flujo).
      // El cobro tiene su propio mail con el detalle y el monto pagado.
      try {
        if (status === "paid") {
          await sendOrderPaidMail(updatedOrder.user, updatedOrder);
        } else {
          await sendOrderStatusChangedMail(updatedOrder.user, updatedOrder);
        }
      } catch (mailError) {
        console.error("No se pudo enviar el mail de cambio de estado:", mailError.message);
      }

      return res.status(200).json({
        message: "Pedido actualizado correctamente",
        order: updatedOrder,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      const userId = req.auth.id;
      const { id } = req.params;

      const order = await orderRepository.getOrderById(id);

      if (!order)
        return res.status(404).json({ message: "Pedido no encontrado" });

      // Un usuario solo puede cancelar sus propios pedidos.
      if (order.user.toString() !== userId)
        return res.status(403).json({ message: "No podés cancelar este pedido" });

      // Solo se puede cancelar mientras está pendiente: una vez que el admin
      // lo tomó (aceptado, en preparación, etc.) ya hay que coordinarlo aparte.
      if (order.status !== "pending")
        return res.status(400).json({ message: "Este pedido ya no se puede cancelar" });

      const canceledOrder = await orderRepository.cancelOrder(id);

      // Mail de confirmación de cancelación (efecto secundario, no corta el flujo).
      try {
        const user = await userRepository.findById(userId);
        if (user) await sendOrderCanceledMail(user, canceledOrder);
      } catch (mailError) {
        console.error("No se pudo enviar el mail de cancelación de pedido:", mailError.message);
      }

      return res.status(200).json({
        message: "Pedido cancelado correctamente",
        order: canceledOrder,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

const orderController = new OrderController();
export default orderController;
