const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');

class UserService {
    async getMentors(skill, search) {
        const where = {
            role: 'SENIOR' // For now, only seniors are mentors
        };

        if (skill) {
            where.skills = {
                has: skill
            };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } }
            ];
        }

        return userRepository.findAll({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                batch: true,
                avatar: true,
                bio: true,
                experience: true,
                skills: true,
                linkedin: true,
                github: true
            }
        });
    }

    async getJuniors() {
        return userRepository.findAll({
            where: { role: 'JUNIOR' },
            select: { id: true, name: true, email: true, batch: true, avatar: true }
        });
    }

    async getAllUsers() {
        return userRepository.findAll({
            select: { id: true, name: true, email: true, role: true, batch: true, createdAt: true }
        });
    }

    async updateUserRole(id, role) {
        return userRepository.update(
            id,
            { role },
            { id: true, name: true, email: true, role: true }
        );
    }

    async updateProfile(userId, updateDataRaw) {
        const { currentPassword, newPassword, ...rest } = updateDataRaw;
        const updateData = {};

        if (rest.name) updateData.name = rest.name;
        if (rest.batch) updateData.batch = rest.batch;
        if (rest.avatar) updateData.avatar = rest.avatar;
        if (rest.bio !== undefined) updateData.bio = rest.bio;
        if (rest.experience !== undefined) updateData.experience = parseInt(rest.experience);
        if (rest.skills) updateData.skills = rest.skills;
        if (rest.linkedin !== undefined) updateData.linkedin = rest.linkedin;
        if (rest.github !== undefined) updateData.github = rest.github;

        if (newPassword) {
            if (!currentPassword) {
                // We'll throw an error and handle it in controller
                throw new Error('PASSWORD_REQUIRED');
            }

            const userWithPassword = await userRepository.findById(userId);
            if (!userWithPassword) throw new Error('USER_NOT_FOUND');

            const validPassword = await bcrypt.compare(currentPassword, userWithPassword.password);
            if (!validPassword) {
                throw new Error('INVALID_PASSWORD');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        return userRepository.update(
            userId,
            updateData,
            {
                id: true,
                name: true,
                email: true,
                role: true,
                batch: true,
                avatar: true,
                bio: true,
                experience: true,
                skills: true,
                linkedin: true,
                github: true
            }
        );
    }
}

module.exports = new UserService();
