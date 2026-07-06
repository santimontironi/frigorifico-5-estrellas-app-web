import { Router } from 'express'
import categoryController from '../controllers/category.controller.js'
import verifyAuth from '../middlewares/verifyAuth.js'
import verifyRole from '../middlewares/verifyRole.js'

export const router = Router()

router.get('/categories', verifyAuth, verifyRole('admin'), categoryController.getAllCategories)
router.delete('/categories/:id', verifyAuth, verifyRole('admin'), categoryController.deleteCategoryById)
