import express from 'express';
import { 
  getMyCertificates, 
  getCertificateById, 
  verifyCertificate, 
  revokeCertificate, 
  restoreCertificate,
  initiateCertificatePayment,
  verifyCertificatePayment,
  unlockCertificate
} from '../controllers/certificateController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public route for verification (Works without login!)
router.get('/verify/:certificateId', verifyCertificate);

// Protected learner routes
router.get('/my', protect, getMyCertificates);
router.get('/:id', protect, getCertificateById);
router.post('/:id/pay-initiate', protect, initiateCertificatePayment);
router.post('/:id/pay-verify', protect, verifyCertificatePayment);

// Admin routes
router.put('/:id/unlock', protect, adminOnly, unlockCertificate);
router.put('/:id/revoke', protect, adminOnly, revokeCertificate);
router.put('/:id/restore', protect, adminOnly, restoreCertificate);

export default router;
