const express = require('express');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all mentors (for discovery)
router.get('/mentors', authenticateToken, async (req, res) => {
    try {
        const { skill, search } = req.query;

        const where = {
            role: 'SENIOR' // For now, only seniors are mentors
        };

        if (skill) {
            where.skills = {
                has: skill
            };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } }
            ];
        }

        const mentors = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                batch: true,
                avatar: true,
                bio: true,
                experience: true,
                skills: true,
                linkedin: true,
                github: true
            }
        });
        res.json(mentors);
    } catch (error) {
        console.error('Get mentors error:', error);
        res.status(500).json({ error: 'Failed to fetch mentors' });
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

// Update own profile
router.patch('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, batch, avatar, currentPassword, newPassword, bio, experience, skills, linkedin, github } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (batch) updateData.batch = batch;
        if (avatar) updateData.avatar = avatar;
        if (bio !== undefined) updateData.bio = bio;
        if (experience !== undefined) updateData.experience = parseInt(experience);
        if (skills) updateData.skills = skills;
        if (linkedin !== undefined) updateData.linkedin = linkedin;
        if (github !== undefined) updateData.github = github;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password is required to set a new password' });
            }

            // Fetch user with password to verify
            const userWithPassword = await prisma.user.findUnique({
                where: { id: userId }
            });

            const validPassword = await bcrypt.compare(currentPassword, userWithPassword.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid current password' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                batch: true,
                avatar: true,
                bio: true,
                experience: true,
                skills: true,
                linkedin: true,
                github: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
