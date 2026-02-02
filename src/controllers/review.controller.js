class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }

    async createRequest(req, res, next) {
        try {
            const request = await this.reviewService.createRequest(req.user.id, req.body);
            res.status(201).json(request);
        } catch (error) {
            next(error);
        }
    }

    async getMyRequests(req, res, next) {
        try {
            const requests = await this.reviewService.getMyRequests(req.user.id);
            res.json(requests);
        } catch (error) {
            next(error);
        }
    }

    async getPendingRequests(req, res, next) {
        try {
            const requests = await this.reviewService.getPendingRequests(req.user.id);
            res.json(requests);
        } catch (error) {
            next(error);
        }
    }

    async acceptRequest(req, res, next) {
        try {
            const { id } = req.params;
            const request = await this.reviewService.acceptRequest(id, req.user.id);
            res.json(request);
        } catch (error) {
            next(error);
        }
    }

    async submitReview(req, res, next) {
        try {
            const review = await this.reviewService.submitReview(req.user.id, req.body);
            res.status(201).json(review);
        } catch (error) {
            next(error);
        }
    }

    async getMyReviews(req, res, next) {
        try {
            const reviews = await this.reviewService.getMyReviews(req.user.id);
            res.json(reviews);
        } catch (error) {
            next(error);
        }
    }

    async getGivenReviews(req, res, next) {
        try {
            const reviews = await this.reviewService.getGivenReviews(req.user.id);
            res.json(reviews);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ReviewController;
