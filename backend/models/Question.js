const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      minlength: [5, 'Question text must be at least 5 characters long'],
      maxlength: [500, 'Question text must be at most 500 characters long'],
    },

    options: {
      type: [String],
      required: true,
      validate: [
        {
          validator: function (arr) {
            return Array.isArray(arr) && arr.length === 4;
          },
          message: 'Each question must have exactly 4 options',
        },
        {
          validator: function (arr) {
            return arr.every(
              (opt) => typeof opt === 'string' && opt.trim().length > 0
            );
          },
          message: 'All options must be non-empty strings',
        },
      ],
    },

    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer is required'],
      min: [0, 'Correct answer must be between 0 and 3'],
      max: [3, 'Correct answer must be between 0 and 3'],
    },

    explanation: {
      type: String,
      trim: true,
      maxlength: [1000, 'Explanation must be at most 1000 characters long'],
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);