import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import { addReview } from '../controllers/reviewController.js';

const router = express.Router();


router.post('/:serviceId', authenticate, addReview);

export default router;
