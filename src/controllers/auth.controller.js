const authService = require('../services/auth.service');

class AuthController {
    async register(req, res) {
        try {
            const { user, token } = await authService.register(req.body);
            res.status(201).json({ user, token });
        } catch (error) {
            console.error('Register error:', error);
            if (error.message === 'EMAIL_EXISTS') {
                return res.status(400).json({ error: 'Email already registered' });
            }
            res.status(500).json({ error: 'Failed to register user' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await authService.login(email, password);

            // Filter user data for response
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
            console.error('Login error:', error);
            if (error.message === 'INVALID_CREDENTIALS') {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            res.status(500).json({ error: 'Failed to login' });
        }
    }

    async getCurrentUser(req, res) {
        // middleware already attaches user to req
        res.json({ user: req.user });
    }
}

module.exports = new AuthController();
