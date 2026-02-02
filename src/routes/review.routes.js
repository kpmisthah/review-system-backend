const express = require('express');
const { authenticateToken, isSenior } = require('../middleware/auth.middleware');
const reviewController = require('../controllers/review.controller');

const router = express.Router();

// ============ REVIEW REQUESTS ============

// Create review request (Junior)
router.post('/requests', authenticateToken, (req, res) => reviewController.createRequest(req, res));

// Get my review requests (Junior)
router.get('/requests/my', authenticateToken, (req, res) => reviewController.getMyRequests(req, res));

// Get pending requests (Senior - requests assigned to them)
router.get('/requests/pending', authenticateToken, isSenior, (req, res) => reviewController.getPendingRequests(req, res));

// Accept a review request (Senior)
router.patch('/requests/:id/accept', authenticateToken, isSenior, (req, res) => reviewController.acceptRequest(req, res));

// ============ REVIEWS ============

// Submit review (Senior)
router.post('/', authenticateToken, isSenior, (req, res) => reviewController.submitReview(req, res));

// Get my reviews (Junior - reviews I received)
router.get('/my', authenticateToken, (req, res) => reviewController.getMyReviews(req, res));

// Get reviews given by senior
router.get('/given', authenticateToken, isSenior, (req, res) => reviewController.getGivenReviews(req, res));

module.exports = router;
