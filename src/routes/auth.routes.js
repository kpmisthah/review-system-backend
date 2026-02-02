const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateRegistration, validateLogin } = require('../middleware/validation.middleware');
const { authController } = require('../container');

const router = express.Router();

// Register new user
router.post('/register', validateRegistration, (req, res, next) => authController.register(req, res, next));

// Login user
router.post('/login', validateLogin, (req, res, next) => authController.login(req, res, next));

// Get current user profile
router.get('/me', authenticateToken, (req, res, next) => authController.getCurrentUser(req, res, next));

module.exports = router;
