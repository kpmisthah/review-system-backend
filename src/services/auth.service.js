import jwt from 'jsonwebtoken';
import { AuthenticationError, ValidationError } from '../utils/AppError.js';

export default class AuthService {
    constructor(userRepository, passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    /**
     * Register a new user
     * @param {Object} data - Registration data
     * @returns {Promise<{user: Object, token: string}>}
     */
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

    /**
     * Authenticate user and return token
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{user: Object, token: string}>}
     */
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

    /**
     * Generate JWT Token
     * @param {string} userId 
     * @returns {string} JWT Token
     */
    generateToken(userId) {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    }
}
