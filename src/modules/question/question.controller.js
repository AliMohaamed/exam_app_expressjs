import { Exam } from "../../../DB/models/exam.model.js";
import { Question } from "../../../DB/models/question.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/response.js";

// Create Question - Admin only
export const createQuestion = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  const {
    questionText,
    questionType,
    options,
    correctAnswer,
    modelAnswer,
    correctText,
    points,
    difficulty,
  } = req.body;
  // Check if exam exists
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  // Check if user is the creator of the exam or admin
  if (
    exam.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to add questions to this exam");
  }
  const question = await Question.create({
    questionText,
    questionType,
    options: questionType === "multiple-choice" ? options : undefined,
    correctAnswer: questionType === "true-false" ? correctAnswer : undefined,
    modelAnswer: questionType === "essay" ? modelAnswer : undefined,
    correctText: questionType === "fill-blank" ? correctText : undefined,
    points: points || 1,
    difficulty: difficulty || "medium",
    exam: examId,
  });
  if (!question) return next(new ApiError(400, "Can not create question"));

  sendResponse(res, {
    statusCode: 201,
    data: question,
    message: "Question created successfully",
  });
});

// Get All Questions for an Exam
export const getQuestionsByExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  const {
    page = 1,
    limit = 10,
    questionType,
    questionText,
    difficulty,
    points,
  } = req.query;

  // Check if exam exists
  const exam = await Exam.findById(examId);
  if (!exam) return next(new ApiError(404, "Exam not found"));

  const filter = { exam: examId };
  if (difficulty) filter.difficulty = difficulty;
  if (questionType) filter.questionType = questionType;

  if (questionText) filter.questionText = { $regex: questionText, option: "i" };
  if (points) filter.points = {};

  const questions = await Question.find(filter)
    .populate("exam", "subject level duration")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Question.countDocuments(filter);

  sendResponse(res, {
    data: {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      questions,
      exam: {
        _id: exam._id,
        subject: exam.subject,
        level: exam.level,
      },
    },
    message: "Questions retrieved successfully",
  });
});
