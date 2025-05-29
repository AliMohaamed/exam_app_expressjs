import { AttemptService } from "../../services/attempt.service.js";
import { ExamService } from "../../services/exam.service.js";
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

export const getAllAttempts = asyncHandler(async (req, res) => {
  const { status, isPassed, minScore, maxScore, fromDate, toDate } = req.query;
  const results = await AttemptService.getAllAttempts({ status });
  res.json({ results });
});
