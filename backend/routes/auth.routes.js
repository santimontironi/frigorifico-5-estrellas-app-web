import { Router } from 'express'
import authController from '../controllers/auth.controller.js'
import verifyAuth from '../middlewares/verifyAuth.js'
import { authLimiter } from '../middlewares/rateLimiters.js'
import { validate } from '../middlewares/validate.js'
import { loginSchema, userRegisterSchema, adminRegisterSchema } from '../../shared/index.js'
import verifyRole from '../middlewares/verifyRole.js'

export const router = Router()

router.post('/register/user', authLimiter, validate(userRegisterSchema), authController.register)
router.post('/register/admin', authLimiter, validate(adminRegisterSchema), authController.registerAdmin)
router.post('/register/employee', authLimiter, verifyAuth, verifyRole('admin'), validate(adminRegisterSchema), authController.registerEmployee)
router.get('/employees', verifyAuth, verifyRole('admin'), authController.getEmployees)
router.post('/login', authLimiter, validate(loginSchema), authController.login)
router.post('/logout', authController.logout)
router.get('/confirm/:token', authController.confirmUser)
router.get('/me', verifyAuth, authController.me)
router.get('/profile', verifyAuth, authController.profile)
