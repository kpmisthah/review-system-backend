const reviewService = require('../services/review.service');

class ReviewController {
    // Junior: Create a review request
    async createRequest(req, res) {
        try {
            const request = await reviewService.createRequest(req.user.id, req.body);
            res.status(201).json(request);
        } catch (error) {
            console.error('Create request error:', error);
            res.status(500).json({ error: 'Failed to create review request' });
        }
    }

    // Junior: Get my requests
    async getMyRequests(req, res) {
        try {
            const requests = await reviewService.getMyRequests(req.user.id);
            res.json(requests);
        } catch (error) {
            console.error('Get my requests error:', error);
            res.status(500).json({ error: 'Failed to fetch requests' });
        }
    }

    // Senior: Get pending requests
    async getPendingRequests(req, res) {
        try {
            const requests = await reviewService.getPendingRequests(req.user.id);
            res.json(requests);
        } catch (error) {
            console.error('Get pending requests error:', error);
            res.status(500).json({ error: 'Failed to fetch pending requests' });
        }
    }

    // Senior: Accept request
    async acceptRequest(req, res) {
        try {
            const { id } = req.params;
            const request = await reviewService.acceptRequest(id, req.user.id);
            res.json(request);
        } catch (error) {
            console.error('Accept request error:', error);
            res.status(500).json({ error: 'Failed to accept request' });
        }
    }

    // Senior: Submit review
    async submitReview(req, res) {
        try {
            const review = await reviewService.submitReview(req.user.id, req.body);
            res.status(201).json(review);
        } catch (error) {
            console.error('Submit review error:', error);
            if (error.message === 'REQUEST_NOT_FOUND') {
                return res.status(404).json({ error: 'Review request not found' });
            }
            res.status(500).json({ error: 'Failed to submit review' });
        }
    }

    // Junior: Get received reviews
    async getMyReviews(req, res) {
        try {
            const reviews = await reviewService.getMyReviews(req.user.id);
            res.json(reviews);
        } catch (error) {
            console.error('Get my reviews error:', error);
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    }

    // Senior: Get given reviews
    async getGivenReviews(req, res) {
        try {
            const reviews = await reviewService.getGivenReviews(req.user.id);
            res.json(reviews);
        } catch (error) {
            console.error('Get given reviews error:', error);
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    }
}

module.exports = new ReviewController();
