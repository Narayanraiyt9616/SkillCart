import express from 'express';
import { startAssessment, submitAssessment, getAttemptResult, getMyAttempts } from '../controllers/assessmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startAssessment);
router.post('/submit', protect, submitAssessment);
router.get('/my-attempts', protect, getMyAttempts);
router.get('/:attemptId/result', protect, getAttemptResult);

export default router;
