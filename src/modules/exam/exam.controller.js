import { Exam } from "../../../DB/models/exam.model.js";
import { Question } from "../../../DB/models/question.model.js";
import { asyncHandler } from "../../utils/handlers/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";
import { statsQuestion } from "../../utils/question/questionUtils.js";

// Create Exam - Admin only
export const createExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.create({ ...req.body, createdBy: req.user._id });

  // await exam.populate("createdBy", "name email");

  sendResponse(res, {
    statusCode: 201,
    data: exam,
    message: "Created Exam Successfully",
  });
});

// Get All Exams
export const getAllExams = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, subject, level } = req.query;

  const filter = {};
  if (subject) filter.subject = { $regex: subject, $options: "i" };
  if (level) filter.level = level;

  const exams = await Exam.find(filter)
    .populate("createdBy", "name email")
    .populate("questions")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Exam.countDocuments(filter);

  sendResponse(res, {
    data: {
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      exams,
    },
    message: "Exams retrieved successfully",
  });
});

// Get Exam by ID
export const getExamById = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.examId)
    .populate("createdBy", "name email")
    .populate("questions");
  if (!exam) return next(new ApiError(404, `Exam not found`));
  sendResponse(res, { data: exam, message: "Exam retrieved successfully" });
});

// Update Exam - Admin only
export const updateExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.examId);

  // Check if user is the creator or admin
  if (
    !exam.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ApiError(403, "Not authorized to update this exam"));
  }

  const updatedExam = await Exam.findByIdAndUpdate(
    req.params.examId,
    req.body,
    { new: true, runValidators: true }
  )
    .populate("createdBy", "name email")
    .populate("questions");

  sendResponse(res, {
    data: updatedExam,
    message: "Exam updated successfully",
  });
});

// Delete Exam - Admin only
export const deleteExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  const exam = await Exam.findById(examId);

  // Check if user is the creator or admin
  if (
    !exam.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ApiError(403, "Not authorized to update this exam"));
  }

  // Delete all questions associated with this exam
  await Question.deleteMany({ exam: examId });

  // Delete the exam
  await Exam.findByIdAndDelete(examId);

  sendResponse(res, {
    message: "Exam deleted successfully",
  });
});

// Get Exam Statistics - Admin only
export const getExamStats = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;

  const exam = await Exam.findById(examId).populate("questions");

  if (!exam) {
    return next(new ApiError(404, "Exam not found"));
  }
  const stats = statsQuestion(exam.questions);

  sendResponse(res, {
    data: { stats, exam },
    message: "Exam statistics retrieved successfully",
  });
});
