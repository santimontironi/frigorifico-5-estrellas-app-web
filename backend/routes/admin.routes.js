import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyRole from "../middlewares/verifyRole.js";

export const router = Router();

router.get("/admin/employees", verifyAuth, verifyRole("admin"), adminController.getEmployees);

router.delete("/admin/employees/:id", verifyAuth, verifyRole("admin"), adminController.deleteEmployee);

router.get("/admin/customers", verifyAuth, verifyRole("admin"), adminController.getCustomers);

router.delete("/admin/customers/:id", verifyAuth, verifyRole("admin"), adminController.deleteCustomer);