import { NotFoundError } from '../utils/AppError.js';

export default class ReviewService {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    /**
     * Create a new review request (Junior)
     * @param {string} userId 
     * @param {Object} requestData 
     * @returns {Promise<Object>}
     */
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

    /**
     * Get review requests for a user
     * @param {string} userId 
     * @returns {Promise<Array>}
     */
    async getMyRequests(userId) {
        return this.reviewRepository.findRequestsByJuniorId(userId);
    }

    /**
     * Get pending requests for a senior
     * @param {string} seniorId 
     * @returns {Promise<Array>}
     */
    async getPendingRequests(seniorId) {
        return this.reviewRepository.findPendingRequestsForSenior(seniorId);
    }

    /**
     * Accept a review request (Senior)
     * @param {string} requestId 
     * @param {string} seniorId 
     * @returns {Promise<Object>}
     */
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

    /**
     * Submit a review (Senior)
     * @param {string} seniorId 
     * @param {Object} reviewData 
     * @returns {Promise<Object>}
     */
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

    /**
     * Get reviews received by a user (Junior)
     * @param {string} userId 
     * @returns {Promise<Array>}
     */
    async getMyReviews(userId) {
        return this.reviewRepository.findReviewsByJuniorId(userId);
    }

    /**
     * Get reviews given by a senior
     * @param {string} seniorId 
     * @returns {Promise<Array>}
     */
    async getGivenReviews(seniorId) {
        return this.reviewRepository.findReviewsBySeniorId(seniorId);
    }
}
