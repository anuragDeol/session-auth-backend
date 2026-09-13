const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
    message: {
        message: 'Too many login attempts! Please try again in sometime.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { rateLimiter };