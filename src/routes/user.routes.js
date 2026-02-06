import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.middleware.js';
import { validateProfileUpdate } from '../middleware/validation.middleware.js';
import { userController } from '../container.js';

const router = express.Router();

// Get all mentors (for discovery)
router.get('/mentors', authenticateToken, (req, res, next) => userController.getMentors(req, res, next));

// Get all juniors (for seniors to view)
router.get('/juniors', authenticateToken, (req, res, next) => userController.getJuniors(req, res, next));

// Get all users (admin only)
router.get('/', authenticateToken, isAdmin, (req, res, next) => userController.getAllUsers(req, res, next));

// Update user role (admin only)
router.patch('/:id/role', authenticateToken, isAdmin, (req, res, next) => userController.updateUserRole(req, res, next));

// Update own profile
router.patch('/profile', authenticateToken, validateProfileUpdate, (req, res, next) => userController.updateProfile(req, res, next));

export default router;
