import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyRole from "../middlewares/verifyRole.js";

export const router = Router();

<<<<<<< HEAD
router.get('/admin/employees', verifyAuth, verifyRole('admin'), adminController.getEmployees)
router.get('/admin/customers', verifyAuth, verifyRole('admin'), adminController.getCustomers)
router.delete('/admin/customers/:id', verifyAuth, verifyRole('admin'), adminController.deleteCustomer)
=======
// Todas las rutas del dominio admin exigen sesión + rol admin
router.get(
  "/admin/employees",
  verifyAuth,
  verifyRole("admin"),
  adminController.getEmployees,
);
router.delete(
  "/admin/employees/:id",
  verifyAuth,
  verifyRole("admin"),
  adminController.deleteEmployee,
);
>>>>>>> c5eef5c01ecdf0f0d49d13e0fd92e1c6433876e8
