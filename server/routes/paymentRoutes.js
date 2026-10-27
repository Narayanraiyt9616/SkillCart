import express from 'express';
import { getPaymentStatus, initiatePayment, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status/:courseId', protect, getPaymentStatus);
router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);

export default router;
