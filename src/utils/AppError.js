class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404, 'NOT_FOUND');
    }
}

class AuthenticationError extends AppError {
    constructor(message) {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}

class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403, 'FORBIDDEN_ERROR');
    }
}

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    AuthenticationError,
    ForbiddenError
};
