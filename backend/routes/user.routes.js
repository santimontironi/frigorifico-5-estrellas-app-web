import { Router } from 'express'
import userController from '../controllers/user.controller.js'

export const router = Router()

router.post('/register/user', userController.register)
router.get('/confirm/:token', userController.confirmUser)
