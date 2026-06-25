import { Router } from 'express'
import userController from '../controllers/user.controller.js'
import verifyAuth from '../middlewares/verifyAuth.js'
import verifyRole from '../middlewares/verifyRole.js'

export const router = Router()

router.post('/register/user', userController.register)
router.post('/login/user', userController.login)
router.post('/logout/user', userController.logout)
router.get('/dashboard/user', verifyAuth, verifyRole('user'), userController.dashboard)
