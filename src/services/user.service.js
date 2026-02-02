const { NotFoundError, ValidationError, AuthenticationError } = require('../utils/AppError');

class UserService {
    constructor(userRepository, passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    async getMentors(skill, search) {
        const where = {
            role: 'SENIOR'
        };

        if (skill) where.skills = { has: skill };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } }
            ];
        }

        return this.userRepository.findAll({
            where,
            select: {
                id: true, name: true, email: true, batch: true,
                avatar: true, bio: true, experience: true,
                skills: true, linkedin: true, github: true
            }
        });
    }

    async getJuniors() {
        return this.userRepository.findAll({
            where: { role: 'JUNIOR' },
            select: { id: true, name: true, email: true, batch: true, avatar: true }
        });
    }

    async getAllUsers() {
        return this.userRepository.findAll({
            select: { id: true, name: true, email: true, role: true, batch: true, createdAt: true }
        });
    }

    async updateUserRole(id, role) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundError('User not found');

        return this.userRepository.update(
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
                throw new ValidationError('Current password is required to set a new password');
            }

            const userWithPassword = await this.userRepository.findById(userId);
            if (!userWithPassword) throw new NotFoundError('User not found');

            const validPassword = await this.passwordService.compare(currentPassword, userWithPassword.password);
            if (!validPassword) {
                throw new AuthenticationError('Invalid current password');
            }

            const hashedPassword = await this.passwordService.hash(newPassword);
            updateData.password = hashedPassword;
        }

        return this.userRepository.update(
            userId,
            updateData,
            {
                id: true, name: true, email: true, role: true,
                batch: true, avatar: true, bio: true,
                experience: true, skills: true,
                linkedin: true, github: true
            }
        );
    }
}

module.exports = UserService;
