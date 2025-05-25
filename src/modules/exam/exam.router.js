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
  idSchema,
  updateExamSchema,
} from "./exam.validation.js";
import questionRouter from "../question/question.router.js";

const router = Router();

//* Question
router.use("/:examId/question", questionRouter);

//* @route POST /api/exam
//* @desc Create a new exam
//* @access Private (Admin only)
router
  .route("/")
  .all(protect)
  .post(authorizeRole("admin"), isValid(createExamSchema), createExam)
  .get(getAllExams);

router
  .route("/:examId")
  .all(protect, authorizeRole("admin"))
  .get(isValid(idSchema), getExamById)
  .put(isValid(updateExamSchema), updateExam)
  .delete(isValid(idSchema), deleteExam);

router.get(
  "/:examId/stats",
  protect,
  authorizeRole("admin"),
  isValid(idSchema),
  getExamStats
);

export default router;
