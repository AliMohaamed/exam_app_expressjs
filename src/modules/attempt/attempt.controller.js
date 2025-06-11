import { ExamAttempt } from "../../../DB/models/attempt.model.js";
import { AttemptService } from "../../services/attempt.service.js";
import { ExamService } from "../../services/exam.service.js";
import { generateAttemptsExcel } from "../../utils/attempt/exportAttemptsToExcel.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/handlers/asyncHandler.js";
import sendResponse from "../../utils/response.js";

export const getAvailableExams = asyncHandler(async (req, res) => {
  const exams = await ExamService.getAvailableExamsForStudent(req.user);
  sendResponse(res, {
    message: "All Exams Available For This Student",
    data: exams,
  });
});

export const startExam = asyncHandler(async (req, res) => {
  const result = await AttemptService.startExam(req.user, req.params.examId);
  sendResponse(res, { message: "Exam started", data: result });
});

export const getExamQuestions = asyncHandler(async (req, res) => {
  const questions = await AttemptService.getQuestions(
    req.user,
    req.params.attemptId
  );
  sendResponse(res, {
    message: "Exam questions retrieved successfully",
    data: questions,
  });
});

export const submitExam = asyncHandler(async (req, res) => {
  const result = await AttemptService.submitExam(
    req.user,
    req.params.attemptId,
    req.body.answers
  );
  sendResponse(res, { message: "Exam submitted successfully", data: result });
});

export const getExamResult = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const result = await AttemptService.getExamResult(req.user._id, attemptId);
  sendResponse(res, { message: "The Result For Attempt", data: result });
});

export const getAllResultsForStudent = asyncHandler(async (req, res) => {
  const result = await AttemptService.getAllResultsForStudent(req.user._id);
  sendResponse(res, { message: "All Results For This Student", data: result });
});

/*
 * Admin Routes
 */
export const getAllAttempts = asyncHandler(async (req, res, next) => {
  const data = await AttemptService.getAllAttemptsService(req.query);

  sendResponse(res, {
    message: "Exam Attempts Retrieved Successfully",
    data,
  });
});

// Export Excel
export const exportAttemptsToExcel = asyncHandler(async (req, res, next) => {
  const attempts = await ExamAttempt.find()
    .populate("student", "name email level status")
    .populate("exam", "subject description level duration")
    .lean();

  if (!attempts || attempts.length === 0) {
    return next(new ApiError("No attempts found", 404));
  }
  const attemptsWithoutNull = attempts.filter((attempt) => {
    console.log(attempt.student && attempt.exam);
    return attempt.student !== null && attempt.exam !== null;
  });
  console.log(attemptsWithoutNull);
  // Generate Excel workbook
  const workbook = await generateAttemptsExcel(attemptsWithoutNull);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=exam-attempts.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
});
