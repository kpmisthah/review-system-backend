export default class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async getMentors(req, res, next) {
        try {
            const { skill, search } = req.query;
            const mentors = await this.userService.getMentors(skill, search);
            res.json(mentors);
        } catch (error) {
            next(error);
        }
    }

    async getJuniors(req, res, next) {
        try {
            const juniors = await this.userService.getJuniors();
            res.json(juniors);
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async updateUserRole(req, res, next) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const user = await this.userService.updateUserRole(id, role);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const updatedUser = await this.userService.updateProfile(userId, req.body);
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
}
