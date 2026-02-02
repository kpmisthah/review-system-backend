const reviewRepository = require('../repositories/review.repository');

class ReviewService {
    async createRequest(userId, requestData) {
        const { topic, description, seniorId, scheduledAt } = requestData;

        return reviewRepository.createRequest({
            topic,
            description,
            juniorId: userId,
            seniorId: seniorId || null,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null
        });
    }

    async getMyRequests(userId) {
        return reviewRepository.findRequestsByJuniorId(userId);
    }

    async getPendingRequests(seniorId) {
        return reviewRepository.findPendingRequestsForSenior(seniorId);
    }

    async acceptRequest(requestId, seniorId) {
        return reviewRepository.updateRequest(
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
        const request = await reviewRepository.findRequestById(requestId);

        if (!request) {
            throw new Error('REQUEST_NOT_FOUND');
        }

        // Create review
        const review = await reviewRepository.createReview({
            rating,
            strengths,
            improvements,
            notes,
            seniorId: seniorId,
            juniorId: request.juniorId,
            requestId
        });

        // Update request status
        await reviewRepository.updateRequest(requestId, { status: 'COMPLETED' });

        return review;
    }

    async getMyReviews(userId) {
        return reviewRepository.findReviewsByJuniorId(userId);
    }

    async getGivenReviews(seniorId) {
        return reviewRepository.findReviewsBySeniorId(seniorId);
    }
}

module.exports = new ReviewService();
