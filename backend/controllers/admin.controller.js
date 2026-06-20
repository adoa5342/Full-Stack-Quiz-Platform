const Question = require("../models/Question");

const validateQuestion = (q) => {
  if (
    typeof q.questionText !== "string" ||
    q.questionText.trim().length < 5
  ) {
    return "Question text must be at least 5 characters";
  }

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    return "Each question must have exactly 4 options";
  }

  if (
    q.options.some(
      (opt) => typeof opt !== "string" || opt.trim() === ""
    )
  ) {
    return "All options must be non-empty text values";
  }

  const correctAnswer = Number(q.correctAnswer);

  if (
    !Number.isInteger(correctAnswer) ||
    correctAnswer < 0 ||
    correctAnswer > 3
  ) {
    return "Correct answer must be between 0 and 3";
  }

  return null;
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: questions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch questions",
    });
  }
};

const createQuestion = async (req, res) => {
  try {
    const error = validateQuestion(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    const question = await Question.create({
      questionText: req.body.questionText.trim(),
      options: req.body.options.map((option) => option.trim()),
      correctAnswer: Number(req.body.correctAnswer),
      explanation: req.body.explanation || "",
      isActive: req.body.isActive ?? true,
    });

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to create question",
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const error = validateQuestion(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        questionText: req.body.questionText.trim(),
        options: req.body.options.map((option) => option.trim()),
        correctAnswer: Number(req.body.correctAnswer),
        explanation: req.body.explanation || "",
        isActive: req.body.isActive ?? true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to update question",
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.json({
      success: true,
      data: "Question deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to delete question",
    });
  }
};

const toggleQuestionActive = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    question.isActive = !question.isActive;
    await question.save();

    res.json({
      success: true,
      data: question,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to toggle question status",
    });
  }
};

const bulkImportQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Questions must be a non-empty array",
      });
    }

    for (const q of questions) {
      const error = validateQuestion(q);

      if (error) {
        return res.status(400).json({
          success: false,
          error,
        });
      }
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        questionText: q.questionText.trim(),
        options: q.options.map((option) => option.trim()),
        correctAnswer: Number(q.correctAnswer),
        explanation: q.explanation || "",
        isActive: q.isActive ?? true,
      }))
    );

    res.status(201).json({
      success: true,
      data: {
        importedCount: createdQuestions.length,
        questions: createdQuestions,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to bulk import questions",
    });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionActive,
  bulkImportQuestions,
};