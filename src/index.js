const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { AppError } = require('./utils/AppError');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const logger = require('./middleware/logger.middleware');

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/reviews', require('./routes/review.routes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running!' });
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
