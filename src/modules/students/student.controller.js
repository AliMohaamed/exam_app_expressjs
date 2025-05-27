import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/handlers/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import {
  createOne,
  deleteOne,
  getById,
  updateOne,
} from "../../utils/handlers/handlersFactory.js";
import sendResponse from "../../utils/response.js";
import { Exam } from "../../../DB/models/exam.model.js";
import { ExamAttempt } from "../../../DB/models/examAttempt .js";

export const addStudent = createOne(User, {
  isConfirmed: true,
  role: "student",
});

export const getAllStudent = asyncHandler(async (req, res, next) => {
  const students = await User.find({
    role: "student",
    isConfirmed: true,
  }).select({ isConfirmed: 0, password: 0 });

  if (students.length < 1) return next(new ApiError(400, "No Students"));

  sendResponse(res, {
    message: "All Students",
    data: { results: students.length, students },
  });
});

export const getStudentById = getById(User);

export const updateStudent = updateOne(User);

export const deleteStudent = deleteOne(User);

/*************************************************************/
// @desc    Get available exams for student
// @route   GET /api/student/exams/available
// @access  Private (Student)
export const getAvailableExams = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const studentLevel = req.user.level;

  const completedExamIds = await ExamAttempt.distinct("exam", {
    status: "submitted",
    student: studentId,
  });

  const availableExams = await Exam.find({
    level: studentLevel,
    _id: { $nin: completedExamIds },
  })
    .select("subject description level duration createdBy")
    .populate("createdBy", "name -_id");

  sendResponse(res, {
    message: "All Exams Available For This Student",
    data: {
      total: availableExams.length,
      exams: availableExams,
    },
  });
});

// @desc    Start an exam
// @route   POST /api/student/exams/:examId/start
// @access  Private (Student)
export const startExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  const studentId = req.user._id;
  const studentLevel = req.user.level;
  const exam = await Exam.findOne({
    _id: examId,
    level: studentLevel,
  }).populate("questions");

  if (!exam) {
    return next(
      new ApiError(404, "This exam is not available or has no questions")
    );
  }

  if (!exam.questions || exam.questions.length === 0) {
    return next(new ApiError(400, "This exam has no questions yet"));
  }

  const existingAttempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
  });

  if (existingAttempt) {
    return existingAttempt.status === "in-progress"
      ? next(new ApiError(400, "You already started this exam"))
      : next(new ApiError(400, "Already submitted this exam"));
  }

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + exam.duration * 60 * 1000);

  const attempt = await ExamAttempt.create({
    student: studentId,
    exam: examId,
    startTime,
    endTime,
  });
  sendResponse(res, {
    statusCode: 201,
    message: "Exam started successfully",
    data: {
      attemptId: attempt._id,
      exam: {
        subject: exam.subject,
        duration: exam.duration,
        questionsCount: exam.questions.length,
        totalMarks: exam.questions.reduce((total, q) => total + q.points, 0),
        startTime,
        endTime,
      },
    },
  });
});
