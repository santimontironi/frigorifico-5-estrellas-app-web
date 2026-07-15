import orderRepository from "../repository/order.repository.js";
import productRepository from "../repository/product.repository.js";
import userRepository from "../repository/user.repository.js";
import { sendOrderCreatedMail, sendOrderCanceledMail, sendOrderStatusChangedMail, sendOrderPaidMail } from "../utils/order.mail.js";
import { Preference, Payment } from "mercadopago";
import mercadopago from "../config/mercadopago.config.js";

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

  async createPayment(req, res) {
    try {
      const userId = req.auth.id;
      const { id } = req.params;

      const order = await orderRepository.getOrderById(id);

      if (!order)
        return res.status(404).json({ message: "Pedido no encontrado" });

      // Solo el dueño paga su pedido.
      if (order.user.toString() !== userId)
        return res.status(403).json({ message: "No podés pagar este pedido" });

      // El pago se habilita cuando el pedido está en preparación.
      if (order.status !== "in_preparation")
        return res.status(400).json({ message: "Este pedido no está disponible para pago" });

      // Si el admin ya confirmó el peso usamos el monto final; si no, el aproximado.
      const amount = order.finalAmount ?? order.approximateTotal;

      const user = await userRepository.findById(userId);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      // Cobramos el pedido como un único ítem con el monto final: para cortes por
      // kg el peso real puede diferir de la suma de subtotales aproximados.
      const preference = await new Preference(mercadopago).create({
        body: {
          items: [
            {
              id: order._id.toString(),
              title: `Pedido #${order._id.toString().slice(-6).toUpperCase()}`,
              quantity: 1,
              unit_price: Number(amount),
              currency_id: "ARS",
            },
          ],
          payer: { email: user.email },
          back_urls: {
            success: `${process.env.FRONTEND_URL}/pago/exito`,
            failure: `${process.env.FRONTEND_URL}/pago/error`,
            pending: `${process.env.FRONTEND_URL}/pago/pendiente`,
          },
          auto_return: "approved",
          // Referencia para reconocer el pedido cuando llega la notificación del pago.
          external_reference: order._id.toString(),
          // Solo si hay URL pública del back (en dev localhost no recibe webhooks).
          ...(process.env.BACKEND_URL && {
            notification_url: `${process.env.BACKEND_URL}/api/orders/payment/webhook`,
          }),
        },
      });

      await orderRepository.setOrderPreference(id, preference.id);

      return res.status(200).json({
        init_point: preference.init_point,
        preferenceId: preference.id,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async paymentWebhook(req, res) {
    try {
      // MP puede notificar por query (?type=payment&data.id=..) o por body.
      const paymentId = req.query["data.id"] || req.body?.data?.id || req.query.id;

      if (paymentId) {
        const payment = await new Payment(mercadopago).get({ id: paymentId });
        const orderId = payment.external_reference;

        // Solo marcamos pagado cuando el pago está aprobado.
        if (payment.status === "approved" && orderId) {
          const paidOrder = await orderRepository.markOrderAsPaid(orderId, String(paymentId));

          // Aviso de pago al cliente y al frigorífico (no corta el flujo del webhook).
          try {
            if (paidOrder?.user) await sendOrderPaidMail(paidOrder.user, paidOrder);
          } catch (mailError) {
            console.error("No se pudo enviar el mail de pago:", mailError.message);
          }
        }
      }

      // Siempre 200: si devolvemos error, MP reintenta la notificación en bucle.
      return res.sendStatus(200);
    } catch (error) {
      console.error("Error en webhook de Mercado Pago:", error.message);
      return res.sendStatus(200);
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
      const { status, rejectionReason, finalAmount, notesAdmin } = req.body;

      const order = await orderRepository.getOrderById(id);
      if (!order)
        return res.status(404).json({ message: "Pedido no encontrado" });

      // Transiciones permitidas: el pedido avanza en un orden lógico.
      const allowedTransitions = {
        pending: ["in_preparation", "rejected"],
        in_preparation: ["paid", "delivered"],
        paid: ["delivered"],
      };

      const allowed = allowedTransitions[order.status] || [];
      if (!allowed.includes(status))
        return res.status(400).json({ message: `No se puede pasar de "${order.status}" a "${status}"` });

      const data = { status };
      if (status === "rejected") data.rejectionReason = rejectionReason || "";
      if (finalAmount !== undefined) data.finalAmount = finalAmount;
      if (notesAdmin !== undefined) data.notesAdmin = notesAdmin;

      const updatedOrder = await orderRepository.updateOrder(id, data);

      // Aviso al cliente del cambio de estado (efecto secundario, no corta el flujo).
      try {
        await sendOrderStatusChangedMail(updatedOrder.user, updatedOrder);
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
