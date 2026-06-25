import { Router } from "express";
import adminController from "../controllers/admin.controller.js";

export const router = Router();

router.post('/register', adminController.registerAdmin)
router.post('/login', adminController.loginAdmin)
router.post('/logout', adminController.logout)