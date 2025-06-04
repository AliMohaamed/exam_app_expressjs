import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  exportAttemptsToExcel,
  getAllAttempts,
  getAllResultsForStudent,
  getAvailableExams,
  getExamQuestions,
  getExamResult,
  startExam,
  submitExam,
} from "./attempt.controller.js";
import { examSubmitSchema, getAttemptIdSchema } from "./attempt.validation.js";
import { examIdSchema } from "../exam/exam.validation.js";

const router = Router();

// Student Routes

// Get all available exams for a student
router.get("/available", protect, authorizeRole("student"), getAvailableExams);
// Start an exam
router.post(
  "/:examId/start",
  protect,
  authorizeRole("student"),
  isValid(examIdSchema),
  startExam
);
// Get questions for an exam attempt
router.get(
  "/attempts/:attemptId/questions",
  protect,
  authorizeRole("student"),
  isValid(getAttemptIdSchema),
  getExamQuestions
);
// Submit an exam attempt
router.post(
  "/attempts/:attemptId/submit",
  protect,
  authorizeRole("student"),
  isValid(examSubmitSchema),
  submitExam
);
// Get the result of an exam attempt
router.get(
  "/attempts/:attemptId/result",
  protect,
  authorizeRole("student"),
  isValid(getAttemptIdSchema),
  getExamResult
);
// Get all results for a student
router.get(
  "/results",
  protect,
  authorizeRole("student"),
  getAllResultsForStudent
);

/*
 * Admin Routes
 */

// Get all available exams for an admin
router.get("/attempts", protect, authorizeRole("admin"), getAllAttempts);
router.get(
  "/attempts/export-excel",
  protect,
  authorizeRole("admin"),
  exportAttemptsToExcel
);

export default router;
