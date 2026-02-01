const userService = require('../services/user.service');

class UserController {
    async getMentors(req, res) {
        try {
            const { skill, search } = req.query;
            const mentors = await userService.getMentors(skill, search);
            res.json(mentors);
        } catch (error) {
            console.error('Get mentors error:', error);
            res.status(500).json({ error: 'Failed to fetch mentors' });
        }
    }

    async getJuniors(req, res) {
        try {
            const juniors = await userService.getJuniors();
            res.json(juniors);
        } catch (error) {
            console.error('Get juniors error:', error);
            res.status(500).json({ error: 'Failed to fetch juniors' });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    }

    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const user = await userService.updateUserRole(id, role);
            res.json(user);
        } catch (error) {
            console.error('Update role error:', error);
            res.status(500).json({ error: 'Failed to update user role' });
        }
    }

    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const updatedUser = await userService.updateProfile(userId, req.body);
            res.json(updatedUser);
        } catch (error) {
            console.error('Update profile error:', error);
            if (error.message === 'PASSWORD_REQUIRED') {
                return res.status(400).json({ error: 'Current password is required to set a new password' });
            }
            if (error.message === 'INVALID_PASSWORD') {
                return res.status(401).json({ error: 'Invalid current password' });
            }
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }
}

module.exports = new UserController();
