import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import { validate } from '../middlewares/validate.js'
import { ChangePasswordSchema, ResetPasswordSchema } from '../../shared/index.js'

export const router = Router()

router.post('/change-password', validate(ChangePasswordSchema), userController.changePassword)
router.post('/change-password/:token', validate(ResetPasswordSchema), userController.changePasswordConfirm)
