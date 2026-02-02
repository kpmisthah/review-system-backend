const jwt = require('jsonwebtoken');
const { AuthenticationError, ValidationError } = require('../utils/AppError');

class AuthService {
    constructor(userRepository, passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    async register(data) {
        const { email, password, name, role, batch } = data;

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        const hashedPassword = await this.passwordService.hash(password);

        const user = await this.userRepository.create({
            email,
            password: hashedPassword,
            name,
            role: role || 'JUNIOR',
            batch
        }, { id: true, email: true, name: true, role: true, batch: true });

        const token = this.generateToken(user.id);

        return { user, token };
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }

        const validPassword = await this.passwordService.compare(password, user.password);
        if (!validPassword) {
            throw new AuthenticationError('Invalid email or password');
        }

        const token = this.generateToken(user.id);

        return { user, token };
    }

    generateToken(userId) {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    }
}

module.exports = AuthService;
