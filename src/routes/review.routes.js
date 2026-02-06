import express from 'express';
import { authenticateToken, isSenior } from '../middleware/auth.middleware.js';
import { validateReviewRequest, validateReviewSubmission } from '../middleware/validation.middleware.js';
import { reviewController } from '../container.js';

const router = express.Router();

// ============ REVIEW REQUESTS ============

// Create review request (Junior)
router.post('/requests', authenticateToken, validateReviewRequest, (req, res, next) => reviewController.createRequest(req, res, next));

// Get my review requests (Junior)
router.get('/requests/my', authenticateToken, (req, res, next) => reviewController.getMyRequests(req, res, next));

// Get pending requests (Senior - requests assigned to them)
router.get('/requests/pending', authenticateToken, isSenior, (req, res, next) => reviewController.getPendingRequests(req, res, next));

// Accept a review request (Senior)
router.patch('/requests/:id/accept', authenticateToken, isSenior, (req, res, next) => reviewController.acceptRequest(req, res, next));

// ============ REVIEWS ============

// Submit review (Senior)
router.post('/', authenticateToken, isSenior, validateReviewSubmission, (req, res, next) => reviewController.submitReview(req, res, next));

// Get my reviews (Junior - reviews I received)
router.get('/my', authenticateToken, (req, res, next) => reviewController.getMyReviews(req, res, next));

// Get reviews given by senior
router.get('/given', authenticateToken, isSenior, (req, res, next) => reviewController.getGivenReviews(req, res, next));

export default router;
