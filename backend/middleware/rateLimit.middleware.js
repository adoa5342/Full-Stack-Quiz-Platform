const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many login attempts. Please try again later.",
  },
});

const quizSubmitLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many quiz submissions. Please slow down.",
  },
});

module.exports = {
  loginLimiter,
  quizSubmitLimiter,
};