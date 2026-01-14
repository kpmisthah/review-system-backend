const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all seniors (for juniors to request reviews)
router.get('/seniors', authenticateToken, async (req, res) => {
    try {
        const seniors = await prisma.user.findMany({
            where: { role: 'SENIOR' },
            select: { id: true, name: true, email: true, batch: true, avatar: true }
        });
        res.json(seniors);
    } catch (error) {
        console.error('Get seniors error:', error);
        res.status(500).json({ error: 'Failed to fetch seniors' });
    }
});

// Get all juniors (for seniors to view)
router.get('/juniors', authenticateToken, async (req, res) => {
    try {
        const juniors = await prisma.user.findMany({
            where: { role: 'JUNIOR' },
            select: { id: true, name: true, email: true, batch: true, avatar: true }
        });
        res.json(juniors);
    } catch (error) {
        console.error('Get juniors error:', error);
        res.status(500).json({ error: 'Failed to fetch juniors' });
    }
});

// Get all users (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, batch: true, createdAt: true }
        });
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update user role (admin only)
router.patch('/:id/role', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, name: true, email: true, role: true }
        });

        res.json(user);
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

module.exports = router;
