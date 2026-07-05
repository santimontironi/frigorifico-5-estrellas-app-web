import { Router } from 'express'
import categoryController from '../controllers/category.controller.js'

export const router = Router()

router.get('/categories', categoryController.getAllCategories)
