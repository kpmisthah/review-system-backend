import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppError } from './utils/AppError.js';
import logger from './middleware/logger.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import reviewRoutes from './routes/review.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running!',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    // console.error(err.stack); // Optionally log stack trace

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Handle generic/unexpected errors
    console.error('Unexpected Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
