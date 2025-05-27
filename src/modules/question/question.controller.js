import { Exam } from "../../../DB/models/exam.model.js";
import { Question } from "../../../DB/models/question.model.js";
import { asyncHandler } from "../../utils/handlers/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";
import { QuestionService } from "../../services/question.service.js";
import { isOwnerOrAdmin } from "../../utils/auth/auth.js";

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
  if (!isOwnerOrAdmin(req.user, exam.createdBy)) {
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

  if (questionText)
    filter.questionText = { $regex: questionText, $options: "i" };
  if (points) filter.points = {};
  console.log(filter);
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

// Get Question by ID
export const getQuestionById = asyncHandler(async (req, res, next) => {
  const { examId, questionId } = req.params;
  // Check if exam exists
  const exam = await Exam.findById(examId);
  if (!exam) return next(new ApiError(404, "Exam not found"));

  const question = await Question.findById(questionId).populate({
    path: "exam",
    select: "subject level createdBy",
    populate: {
      path: "createdBy",
      select: "name email -_id",
    },
  });
  if (!question) return next(new ApiError(404, "Question not found"));

  sendResponse(res, {
    message: "Question retrieved successfully",
    data: question,
  });
});

// Update Question - Admin only
export const updateQuestion = asyncHandler(async (req, res, next) => {
  const { examId, questionId } = req.params;

  const updatedQuestion = await QuestionService.updateQuestionService({
    examId,
    questionId,
    user: req.user,
    data: req.body,
  });

  res.status(200).json({
    success: true,
    message: "Question updated successfully",
    data: updatedQuestion,
  });
});

// Delete Question - Admin only
export const deleteQuestion = asyncHandler(async (req, res) => {
  const { examId, questionId } = req.params;

  // Delete From Service
  const { message } = await QuestionService.deleteQuestionService({
    examId,
    questionId,
    user: req.user,
  });

  sendResponse(res, {
    statusCode: 200,
    message,
  });
});

// Bulk Create Questions - Admin only
export const bulkCreateQuestions = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const { questions } = req.body;

  // Check if exam exists
  const exam = await Exam.findById(examId);
  if (!exam) return next(new ApiError(404, "Exam not found"));

  // Check if user is the creator of the exam or admin
  if (!isOwnerOrAdmin(req.user, exam.createdBy)) {
    throw new ApiError(403, "Not authorized to add questions to this exam");
  }
  const questionsWithExam = questions.map((question) => ({
    ...question,
    exam: examId,
  }));
  console.log(questionsWithExam);

  const createdQuestions = await Question.insertMany(questionsWithExam);

  sendResponse(res, {
    statusCode: 201,
    data: createdQuestions,
    message: `${createdQuestions.length} questions created successfully`,
  });
});
