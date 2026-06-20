const express = require("express");

const {
  getQuizQuestions,
  submitQuiz,
  getQuizHistory,
  getQuizReview,
} = require("../controllers/quiz.controller");

const authMiddleware = require("../middleware/auth.middleware");
const { quizSubmitLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

// public route
router.get("/questions", getQuizQuestions);

// protected routes
router.post("/submit", quizSubmitLimiter, authMiddleware, submitQuiz);
router.get("/history", authMiddleware, getQuizHistory);
router.get("/review/:scoreId", authMiddleware, getQuizReview);

module.exports = router;