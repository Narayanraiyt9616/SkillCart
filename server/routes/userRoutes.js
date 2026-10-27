import express from 'express';
import { getProfile, updateProfile, getPublicProfile, getUsers, toggleUserSuspend } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public user profile by username
router.get('/public/:username', getPublicProfile);

// Authenticated user profile
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin management
router.get('/', protect, adminOnly, getUsers);
router.put('/:id/suspend', protect, adminOnly, toggleUserSuspend);

export default router;
