import UserRepository from './repositories/user.repository.js';
import ReviewRepository from './repositories/review.repository.js';

import PasswordService from './services/password.service.js';
import UserService from './services/user.service.js';
import AuthService from './services/auth.service.js';
import ReviewService from './services/review.service.js';

import UserController from './controllers/user.controller.js';
import AuthController from './controllers/auth.controller.js';
import ReviewController from './controllers/review.controller.js';

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

export {
    userController,
    authController,
    reviewController
};
