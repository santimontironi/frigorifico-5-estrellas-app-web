import { Router } from 'express'
import userController from '../controllers/user.controller.js'

export const router = Router()

router.post('/change-password', userController.changePassword)
router.post('/change-password/:token', userController.changePasswordConfirm)
