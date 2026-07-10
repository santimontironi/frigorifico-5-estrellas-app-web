import { Router } from 'express';
import offerController from '../controllers/offer.controller.js';
import verifyAuth from '../middlewares/verifyAuth.js';
import verifyRole from '../middlewares/verifyRole.js';
import { uploadImage } from '../middlewares/multer.js';
import { validate } from '../middlewares/validate.js';
import { createOfferSchema } from '../../shared/index.js';


export const router = Router();

router.post('/offers', verifyAuth, verifyRole('admin'), uploadImage.single('image'), validate(createOfferSchema), offerController.createOffer);
router.get('/offers', offerController.getAllOffers);
router.delete('/offers/:id', verifyAuth, verifyRole('admin'), offerController.deleteOffer);