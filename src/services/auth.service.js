const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async register(data) {
        const { email, password, name, role, batch } = data;

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('EMAIL_EXISTS');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userRepository.create({
            email,
            password: hashedPassword,
            name,
            role: role || 'JUNIOR',
            batch
        }, { id: true, email: true, name: true, role: true, batch: true });

        // We only want to return specific fields, but create returns all. 
        // We can filter in controller or here. Let's do nothing here to keep it simple or use select in create if repository supports it.
        // My UserRepository.create takes `data`. It simply returns logic.

        // Generate token
        const token = this.generateToken(user.id);

        return { user, token };
    }

    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const token = this.generateToken(user.id);

        return { user, token };
    }

    generateToken(userId) {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    }
}

module.exports = new AuthService();
