const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken, isSenior } = require('../middleware/auth.middleware');

const router = express.Router();

// ============ REVIEW REQUESTS ============

// Create review request (Junior)
router.post('/requests', authenticateToken, async (req, res) => {
    try {
        const { topic, description, seniorId, scheduledAt } = req.body;

        const request = await prisma.reviewRequest.create({
            data: {
                topic,
                description,
                juniorId: req.user.id,
                seniorId: seniorId || null,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null
            },
            include: {
                junior: { select: { id: true, name: true, email: true } },
                senior: { select: { id: true, name: true, email: true } }
            }
        });

        res.status(201).json(request);
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({ error: 'Failed to create review request' });
    }
});

// Get my review requests (Junior)
router.get('/requests/my', authenticateToken, async (req, res) => {
    try {
        const requests = await prisma.reviewRequest.findMany({
            where: { juniorId: req.user.id },
            include: {
                senior: { select: { id: true, name: true, email: true } },
                review: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(requests);
    } catch (error) {
        console.error('Get my requests error:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Get pending requests (Senior - requests assigned to them)
router.get('/requests/pending', authenticateToken, isSenior, async (req, res) => {
    try {
        const requests = await prisma.reviewRequest.findMany({
            where: {
                OR: [
                    { seniorId: req.user.id, status: 'PENDING' },
                    { seniorId: req.user.id, status: 'ACCEPTED' },
                    { seniorId: null, status: 'PENDING' } // Unassigned requests
                ]
            },
            include: {
                junior: { select: { id: true, name: true, email: true, batch: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(requests);
    } catch (error) {
        console.error('Get pending requests error:', error);
        res.status(500).json({ error: 'Failed to fetch pending requests' });
    }
});

// Accept a review request (Senior)
router.patch('/requests/:id/accept', authenticateToken, isSenior, async (req, res) => {
    try {
        const { id } = req.params;

        const request = await prisma.reviewRequest.update({
            where: { id },
            data: {
                status: 'ACCEPTED',
                seniorId: req.user.id
            },
            include: {
                junior: { select: { id: true, name: true, email: true } }
            }
        });

        res.json(request);
    } catch (error) {
        console.error('Accept request error:', error);
        res.status(500).json({ error: 'Failed to accept request' });
    }
});

// ============ REVIEWS ============

// Submit review (Senior)
router.post('/', authenticateToken, isSenior, async (req, res) => {
    try {
        const { requestId, rating, strengths, improvements, notes } = req.body;

        // Get the request to find junior
        const request = await prisma.reviewRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            return res.status(404).json({ error: 'Review request not found' });
        }

        // Create review and update request status
        const review = await prisma.review.create({
            data: {
                rating,
                strengths,
                improvements,
                notes,
                seniorId: req.user.id,
                juniorId: request.juniorId,
                requestId
            },
            include: {
                senior: { select: { id: true, name: true } },
                junior: { select: { id: true, name: true } }
            }
        });

        // Update request status
        await prisma.reviewRequest.update({
            where: { id: requestId },
            data: { status: 'COMPLETED' }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Submit review error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

// Get my reviews (Junior - reviews I received)
router.get('/my', authenticateToken, async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { juniorId: req.user.id },
            include: {
                senior: { select: { id: true, name: true } },
                request: { select: { topic: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reviews);
    } catch (error) {
        console.error('Get my reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Get reviews given by senior
router.get('/given', authenticateToken, isSenior, async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { seniorId: req.user.id },
            include: {
                junior: { select: { id: true, name: true } },
                request: { select: { topic: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(reviews);
    } catch (error) {
        console.error('Get given reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

module.exports = router;
