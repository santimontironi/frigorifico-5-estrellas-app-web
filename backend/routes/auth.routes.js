import { Router } from 'express'
import authController from '../controllers/auth.controller.js'
import verifyAuth from '../middlewares/verifyAuth.js'

export const router = Router()

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/me', verifyAuth, authController.me)
router.get('/profile', verifyAuth, authController.profile)
