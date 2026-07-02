import { Router } from 'express'
import adminController from '../controllers/admin.controller.js'

export const router = Router()

router.post('/register/admin', adminController.registerAdmin)
