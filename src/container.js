const UserRepository = require('./repositories/user.repository');
const ReviewRepository = require('./repositories/review.repository');

const PasswordService = require('./services/password.service');
const UserService = require('./services/user.service');
const AuthService = require('./services/auth.service');
const ReviewService = require('./services/review.service');

const UserController = require('./controllers/user.controller');
const AuthController = require('./controllers/auth.controller');
const ReviewController = require('./controllers/review.controller');

// Repositories
const userRepository = new UserRepository();
const reviewRepository = new ReviewRepository();

// Services
const passwordService = new PasswordService();
const userService = new UserService(userRepository, passwordService);
const authService = new AuthService(userRepository, passwordService);
const reviewService = new ReviewService(reviewRepository);

// Controllers
const userController = new UserController(userService);
const authController = new AuthController(authService);
const reviewController = new ReviewController(reviewService);

module.exports = {
    userController,
    authController,
    reviewController
    // Can export services/repos if needed eleswhere
};
