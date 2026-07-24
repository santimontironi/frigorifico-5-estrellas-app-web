import { Router } from 'express';
import photoController from '../controllers/photo.controller.js';
import verifyAuth from '../middlewares/verifyAuth.js';
import verifyRole from '../middlewares/verifyRole.js';
import { uploadImage } from '../middlewares/multer.js';

export const router = Router();

router.post('/photos', verifyAuth, verifyRole('admin'), uploadImage.single('image'), photoController.createPhoto);
router.get('/photos', photoController.getAllPhotos);
router.delete('/photos/:id', verifyAuth, verifyRole('admin'), photoController.deletePhoto);
