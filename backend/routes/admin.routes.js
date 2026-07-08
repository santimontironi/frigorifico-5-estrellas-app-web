import { Router } from 'express'
import adminController from '../controllers/admin.controller.js'
import verifyAuth from '../middlewares/verifyAuth.js'
import verifyRole from '../middlewares/verifyRole.js'

export const router = Router()

// Todas las rutas del dominio admin exigen sesión + rol admin
router.get('/admin/employees', verifyAuth, verifyRole('admin'), adminController.getEmployees)
