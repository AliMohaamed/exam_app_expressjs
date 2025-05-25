import mongoose, { Schema, model } from "mongoose";
import ApiError from "../../src/utils/error/ApiError.js";

const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    questionType: {
      type: String,
      enum: ["multiple-choice", "true-false", "essay", "fill-blank"],
      default: "multiple-choice",
      required: true,
    },
    options: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    correctAnswer: {
      type: Boolean,
      required: function () {
        return this.questionType === "true-false";
      },
    },
    modelAnswer: {
      type: String,
      required: function () {
        return this.questionType === "essay";
      },
      maxlength: 1000,
    },
    correctText: {
      type: String,
      required: function () {
        return this.questionType === "fill-blank";
      },
    },
    points: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    // ✅ Versioning history
    previousVersions: [
      {
        questionText: String,
        questionType: String,
        options: [
          {
            text: String,
            isCorrect: Boolean,
          },
        ],
        correctAnswer: Boolean,
        modelAnswer: String,
        correctText: String,
        points: Number,
        difficulty: String,
        updatedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Middleware to save the previous version before updates ✅
questionSchema.pre("save", function (next) {
  if (!this.isNew && this.isModified()) {
    const fieldsToTrack = {
      questionText: this.questionText,
      questionType: this.questionType,
      options: this.options,
      correctAnswer: this.correctAnswer,
      modelAnswer: this.modelAnswer,
      correctText: this.correctText,
      points: this.points,
      difficulty: this.difficulty,
      updatedAt: new Date(),
    };

    this.previousVersions.push(fieldsToTrack);
  }

  if (this.questionType === "multiple-choice") {
    if (!this.options || this.options.length < 2) {
      return next(
        new ApiError(
          400,
          "Multiple choice questions must have at least 2 options"
        )
      );
    }

    const correctAnswers = this.options.filter((option) => option.isCorrect);
    if (correctAnswers.length === 0) {
      return next(
        new ApiError(
          400,
          "Multiple choice questions must have at least one correct answer"
        )
      );
    }
  }

  next();
});

export const Question =
  mongoose.models.Question || model("Question", questionSchema);
