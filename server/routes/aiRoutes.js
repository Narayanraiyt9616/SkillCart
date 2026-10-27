import express from 'express';
import {
  chatWithAssistant,
  generatePracticeQuiz,
  getAIStatus,
  validateApiKey,
  analyzeResumeForATS,
} from '../controllers/aiController.js';

const router = express.Router();

// Public / Assistant routes
router.get('/status', getAIStatus);
router.post('/chat', chatWithAssistant);
router.post('/generate-quiz', generatePracticeQuiz);
router.post('/validate-key', validateApiKey);
router.post('/analyze-resume', analyzeResumeForATS);

export default router;
