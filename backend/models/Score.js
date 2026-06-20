const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },

    selectedAnswer: {
      type: Number,
      required: true,
      min: [0, 'Selected answer must be between 0 and 3'],
      max: [3, 'Selected answer must be between 0 and 3'],
    },

    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    score: {
      type: Number,
      required: true,
      min: [0, 'Score cannot be negative'],
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: [1, 'There must be at least 1 question'],
    },
    
    answers: {
      type: [answerSchema],
      required: true,
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'A quiz attempt must include at least one answer',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Score', scoreSchema);