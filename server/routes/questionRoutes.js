import express from 'express';
import { getQuestionsByCourse, addQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', protect, getQuestionsByCourse);
router.post('/', protect, adminOnly, addQuestion);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

export default router;
