import { Router } from 'express';
import orderController from '../controllers/order.controller.js';
import verifyAuth from '../middlewares/verifyAuth.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from '../../shared/index.js';
import verifyRole from '../middlewares/verifyRole.js';

export const router = Router();

router.post('/orders', verifyAuth, validate(createOrderSchema), verifyRole('user'), orderController.createOrder);
router.get('/orders', verifyAuth, verifyRole('user'), orderController.getUserOrders);
router.patch('/orders/:id/cancel', verifyAuth, verifyRole('user'), orderController.cancelOrder);

router.get('/orders/all', verifyAuth, verifyRole('admin', 'employee'), orderController.getAllOrders);

// El admin/empleado cambia el estado del pedido (preparación, rechazo, entregado...).
router.patch('/orders/:id/status', verifyAuth, verifyRole('admin', 'employee'), validate(updateOrderStatusSchema), orderController.updateOrderStatus);

// Pago con Mercado Pago: el cliente genera la preferencia de su pedido.
router.post('/orders/:id/pay', verifyAuth, verifyRole('user'), orderController.createPayment);

// Webhook público: Mercado Pago notifica el resultado del pago (sin auth).
router.post('/orders/payment/webhook', orderController.paymentWebhook);
