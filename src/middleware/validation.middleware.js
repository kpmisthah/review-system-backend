const { body, validationResult } = require('express-validator');

// Validation wrapper
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg,
            details: errors.array()
        });
    }
    next();
};

const validateRegistration = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    validateRequest
];

const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').exists().withMessage('Password is required'),
    validateRequest
];

const validateProfileUpdate = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validateRequest
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateProfileUpdate
};
