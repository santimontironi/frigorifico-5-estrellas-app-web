import { Router } from 'express'
import authController from '../controllers/auth.controller.js'
import verifyAuth from '../middlewares/verifyAuth.js'

export const router = Router()

router.get('/me', verifyAuth, authController.me)
