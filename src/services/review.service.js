const { NotFoundError } = require('../utils/AppError');

class ReviewService {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async createRequest(userId, requestData) {
        const { topic, description, seniorId, scheduledAt } = requestData;

        return this.reviewRepository.createRequest({
            topic,
            description,
            juniorId: userId,
            seniorId: seniorId || null,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null
        });
    }

    async getMyRequests(userId) {
        return this.reviewRepository.findRequestsByJuniorId(userId);
    }

    async getPendingRequests(seniorId) {
        return this.reviewRepository.findPendingRequestsForSenior(seniorId);
    }

    async acceptRequest(requestId, seniorId) {
        return this.reviewRepository.updateRequest(
            requestId,
            {
                status: 'ACCEPTED',
                seniorId: seniorId
            },
            {
                junior: { select: { id: true, name: true, email: true } }
            }
        );
    }

    async submitReview(seniorId, reviewData) {
        const { requestId, rating, strengths, improvements, notes } = reviewData;

        // Get the request to find junior
        const request = await this.reviewRepository.findRequestById(requestId);

        if (!request) {
            throw new NotFoundError('Review request not found');
        }

        // Create review
        const review = await this.reviewRepository.createReview({
            rating,
            strengths,
            improvements,
            notes,
            seniorId: seniorId,
            juniorId: request.juniorId,
            requestId
        });

        // Update request status
        await this.reviewRepository.updateRequest(requestId, { status: 'COMPLETED' });

        return review;
    }

    async getMyReviews(userId) {
        return this.reviewRepository.findReviewsByJuniorId(userId);
    }

    async getGivenReviews(seniorId) {
        return this.reviewRepository.findReviewsBySeniorId(seniorId);
    }
}

module.exports = ReviewService;
