import prisma from '../config/prisma.js';

export default class UserRepository {
    async create(userData, select = null) {
        return prisma.user.create({
            data: userData,
            select
        });
    }

    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async findAll(options = {}) {
        return prisma.user.findMany(options);
    }

    async update(id, data, select = null) {
        return prisma.user.update({
            where: { id },
            data,
            select
        });
    }
}
