import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import verifyAuth from '../middlewares/verifyAuth.js'
import verifyRole from '../middlewares/verifyRole.js'
import { validate } from '../middlewares/validate.js'
import { ChangePasswordSchema, ResetPasswordSchema, EditProfileSchema } from '../../shared/index.js'

export const router = Router()

router.post('/change-password', validate(ChangePasswordSchema), userController.changePassword)
router.post('/change-password/:token', validate(ResetPasswordSchema), userController.changePasswordConfirm)
router.patch('/profile', verifyAuth, verifyRole('user'), validate(EditProfileSchema), userController.editProfile)
