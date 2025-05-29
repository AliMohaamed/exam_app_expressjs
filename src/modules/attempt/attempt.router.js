import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
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

router.get("/available", protect, authorizeRole("student"), getAvailableExams);

router.post(
  "/:examId/start",
  protect,
  authorizeRole("student"),
  isValid(examIdSchema),
  startExam
);

router.get(
  "/attempts/:attemptId/questions",
  protect,
  authorizeRole("student"),
  isValid(getAttemptIdSchema),
  getExamQuestions
);

router.post(
  "/attempts/:attemptId/submit",
  protect,
  authorizeRole("student"),
  isValid(examSubmitSchema),
  submitExam
);

router.get(
  "/attempts/:attemptId/result",
  protect,
  authorizeRole("student"),
  isValid(getAttemptIdSchema),
  getExamResult
);
router.get(
  "/results",
  protect,
  authorizeRole("student"),
  getAllResultsForStudent
);

export default router;
