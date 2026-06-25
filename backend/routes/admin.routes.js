import { Router } from 'express'
import adminController from '../controllers/admin.controller.js'
import verifyAuth from '../middlewares/verifyAuth.js'
import verifyRole from '../middlewares/verifyRole.js'

export const router = Router()

router.post('/register/admin', adminController.registerAdmin)
router.post('/login/admin', adminController.loginAdmin)
router.get('/dashboard/admin', verifyAuth, verifyRole('admin'), adminController.dashboard)
