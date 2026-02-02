import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateRegistration, validateLogin } from '../middleware/validation.middleware.js';
import { authController } from '../container.js';

const router = express.Router();

// Register new user
router.post('/register', validateRegistration, (req, res, next) => authController.register(req, res, next));

// Login user
router.post('/login', validateLogin, (req, res, next) => authController.login(req, res, next));

// Get current user profile
router.get('/me', authenticateToken, (req, res, next) => authController.getCurrentUser(req, res, next));

export default router;
