import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createExam,
  deleteExam,
  getAllExams,
  getExamById,
  getExamStats,
  updateExam,
} from "./exam.controller.js";
import {
  createExamSchema,
  examIdSchema,
  updateExamSchema,
} from "./exam.validation.js";
import questionRouter from "../question/question.router.js";

const router = Router();

router
  .route("/")
  .all(protect, authorizeRole("admin"))
  .post(isValid(createExamSchema), createExam)
  .get(getAllExams);

router
  .route("/:examId")
  .all(protect, authorizeRole("admin"))
  .get(isValid(examIdSchema), getExamById)
  .put(isValid(updateExamSchema), updateExam)
  .delete(isValid(examIdSchema), deleteExam);

router.get("/:examId/stats", protect,authorizeRole("admin"), isValid(examIdSchema), getExamStats);

router.use("/:examId/question", questionRouter);

export default router;
