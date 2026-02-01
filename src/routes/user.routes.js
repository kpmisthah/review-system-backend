const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Get all mentors (for discovery)
router.get('/mentors', authenticateToken, (req, res) => userController.getMentors(req, res));

// Get all juniors (for seniors to view)
router.get('/juniors', authenticateToken, (req, res) => userController.getJuniors(req, res));

// Get all users (admin only)
router.get('/', authenticateToken, isAdmin, (req, res) => userController.getAllUsers(req, res));

// Update user role (admin only)
router.patch('/:id/role', authenticateToken, isAdmin, (req, res) => userController.updateUserRole(req, res));

// Update own profile
router.patch('/profile', authenticateToken, (req, res) => userController.updateProfile(req, res));

module.exports = router;
