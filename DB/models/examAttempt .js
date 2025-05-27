import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  answer: Schema.Types.Mixed,
  isCorrect: {
    type: Boolean,
    default: null,
  },
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0,
  },
  answeredAt: {
    type: Date,
    default: Date.now,
  },
});

const examAttemptSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    exam: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    answers: [answerSchema],
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["in-progress", "submitted", "auto-submitted"],
      default: "in-progress",
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
      min: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Do Student Passed or Failed
examAttemptSchema.virtual("isPassed").get(function () {
  return this.percentage >= 60;
});

// Pre middleware
examAttemptSchema.pre("save", async function (next) {
  // calculate total
  this.totalScore = this.answers.reduce((total, answer) => {
    return total + (answer.pointsEarned || 0);
  });
  next();
});

export const ExamAttempt = mongoose.models.ExamAttempt;
