const mongoose = require("mongoose");
const Question = require("../models/Question");
const Score = require("../models/Score");

const getUserIdFromRequest = (req) => {
  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.userId ||
    req.user?.user?.id ||
    req.user?.user?._id ||
    req.user?.data?.id ||
    req.user?.data?._id ||
    req.user?.sub ||
    (typeof req.user?.user === "string" ? req.user.user : null)
  );
};

const shuffleArray = (items) => {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
};

const validateSubmittedAnswers = (answers) => {
  if (!Array.isArray(answers) || answers.length === 0) {
    return "Answers must be a non-empty array";
  }

  const seenQuestionIds = new Set();

  for (const answer of answers) {
    if (!answer || typeof answer !== "object") {
      return "Each answer must be an object";
    }

    if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
      return "Each answer must include a valid questionId";
    }

    if (seenQuestionIds.has(answer.questionId)) {
      return "Duplicate answers for the same question are not allowed";
    }

    seenQuestionIds.add(answer.questionId);

    const selectedAnswer = Number(answer.selectedAnswer);

    if (
      !Number.isInteger(selectedAnswer) ||
      selectedAnswer < 0 ||
      selectedAnswer > 3
    ) {
      return "Selected answer must be between 0 and 3";
    }
  }

  return null;
};

const getQuizQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true }).select(
      "-correctAnswer -__v"
    );

    const randomQuestions = shuffleArray(questions);

    return res.status(200).json({
      success: true,
      data: {
        count: randomQuestions.length,
        questions: randomQuestions,
      },
    });
  } catch (error) {
    console.error("Fetch quiz questions error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch quiz questions",
    });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { answers } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
    }

    const validationError = validateSubmittedAnswers(answers);

    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError,
      });
    }

    const questionIds = answers.map((answer) => answer.questionId);

    const questions = await Question.find({
      _id: { $in: questionIds },
      isActive: true,
    });

    if (questions.length !== answers.length) {
      return res.status(400).json({
        success: false,
        error: "One or more questions are invalid or inactive",
      });
    }

    let score = 0;

    const markedAnswers = answers.map((answer) => {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      const selectedAnswer = Number(answer.selectedAnswer);
      const isCorrect = question.correctAnswer === selectedAnswer;

      if (isCorrect) {
        score += 1;
      }

      return {
        questionId: question._id,
        selectedAnswer,
        isCorrect,
      };
    });

    const savedScore = await Score.create({
      userId,
      score,
      totalQuestions: markedAnswers.length,
      answers: markedAnswers,
    });

    return res.status(201).json({
      success: true,
      data: {
        message: "Quiz submitted successfully",
        scoreId: savedScore._id,
        score,
        totalQuestions: markedAnswers.length,
        answers: markedAnswers,
      },
    });
  } catch (error) {
    console.error("Submit quiz error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to submit quiz",
    });
  }
};

const getQuizHistory = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
    }

    const scores = await Score.find({ userId })
      .select("score totalQuestions createdAt updatedAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        count: scores.length,
        scores,
      },
    });
  } catch (error) {
    console.error("Get quiz history error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch quiz history",
    });
  }
};

const getQuizReview = async (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { scoreId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(scoreId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid score ID",
      });
    }

    const score = await Score.findOne({
      _id: scoreId,
      userId,
    }).populate({
      path: "answers.questionId",
      select: "questionText options correctAnswer explanation",
    });

    if (!score) {
      return res.status(404).json({
        success: false,
        error: "Quiz result not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        score,
      },
    });
  } catch (error) {
    console.error("Get quiz review error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch quiz review",
    });
  }
};

module.exports = {
  getQuizQuestions,
  submitQuiz,
  getQuizHistory,
  getQuizReview,
};