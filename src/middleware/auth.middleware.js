const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true, role: true, batch: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Check if user is Senior
const isSenior = (req, res, next) => {
    if (req.user.role !== 'SENIOR' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Senior access required' });
    }
    next();
};

// Check if user is Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

module.exports = { authenticateToken, isSenior, isAdmin };
