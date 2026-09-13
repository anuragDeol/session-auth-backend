const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

router.post('/register', authController.register);
router.post('/login', rateLimiter, authController.login);
router.post('/logout', authController.logout);

// protected route
router.get('/me', isAuthenticated, authController.me);

module.exports = router;