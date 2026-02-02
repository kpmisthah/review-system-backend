class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    async register(req, res, next) {
        try {
            const { user, token } = await this.authService.register(req.body);
            res.status(201).json({ user, token });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, token } = await this.authService.login(email, password);

            // Filter user data for response if not already filtered service
            const safeUser = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                batch: user.batch
            };

            res.json({
                user: safeUser,
                token
            });
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUser(req, res) {
        res.json({ user: req.user });
    }
}

module.exports = AuthController;
