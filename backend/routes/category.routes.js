import { Router } from 'express'
import categoryController from '../controllers/category.controller.js'
import verifyAuth from '../middlewares/verifyAuth.js'
import verifyRole from '../middlewares/verifyRole.js'
import { createCategorySchema } from "../../shared/index.js";
import { validate } from "../middlewares/validate.js";

export const router = Router()

router.post('/categories', verifyAuth, verifyRole('admin'), validate(createCategorySchema), categoryController.createCategory)
router.get('/categories', verifyAuth, verifyRole('admin'), categoryController.getAllCategories)
router.delete('/categories/:id', verifyAuth, verifyRole('admin'), categoryController.deleteCategoryById)
