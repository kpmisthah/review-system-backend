const prisma = require('../config/prisma');

class ReviewRepository {
    // Review Request operations
    async createRequest(data) {
        return prisma.reviewRequest.create({
            data,
            include: {
                junior: { select: { id: true, name: true, email: true } },
                senior: { select: { id: true, name: true, email: true } }
            }
        });
    }

    async findRequestsByJuniorId(juniorId) {
        return prisma.reviewRequest.findMany({
            where: { juniorId },
            include: {
                senior: { select: { id: true, name: true, email: true } },
                review: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findPendingRequestsForSenior(seniorId) {
        return prisma.reviewRequest.findMany({
            where: {
                OR: [
                    { seniorId: seniorId, status: 'PENDING' },
                    { seniorId: seniorId, status: 'ACCEPTED' },
                    { seniorId: null, status: 'PENDING' } // Unassigned requests
                ]
            },
            include: {
                junior: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        batch: true,
                        avatar: true,
                        bio: true,
                        skills: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findRequestById(id) {
        return prisma.reviewRequest.findUnique({
            where: { id }
        });
    }

    async updateRequest(id, data, include = null) {
        return prisma.reviewRequest.update({
            where: { id },
            data,
            include
        });
    }

    // Review operations
    async createReview(data) {
        return prisma.review.create({
            data,
            include: {
                senior: { select: { id: true, name: true } },
                junior: { select: { id: true, name: true } }
            }
        });
    }

    async findReviewsByJuniorId(juniorId) {
        return prisma.review.findMany({
            where: { juniorId },
            include: {
                senior: { select: { id: true, name: true } },
                request: { select: { topic: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findReviewsBySeniorId(seniorId) {
        return prisma.review.findMany({
            where: { seniorId },
            include: {
                junior: { select: { id: true, name: true } },
                request: { select: { topic: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}

module.exports = ReviewRepository;
