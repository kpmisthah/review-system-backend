const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateRegistration, validateLogin } = require('../middleware/validation.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Register new user
router.post('/register', validateRegistration, (req, res) => authController.register(req, res));

// Login user
router.post('/login', validateLogin, (req, res) => authController.login(req, res));

// Get current user profile
router.get('/me', authenticateToken, (req, res) => authController.getCurrentUser(req, res));

module.exports = router;
