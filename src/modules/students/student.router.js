import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import {
  addStudent,
  deleteStudent,
  getAllStudent,
  getStudentById,
  updateStudent,
} from "./student.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  addStudentSchema,
  deleteStudentSchema,
  examSubmitSchema,
  getAttemptIdSchema,
  updateStudentSchema,
} from "./student.validation.js";
import { examIdSchema } from "../exam/exam.validation.js";
import {
  getAvailableExams,
  getExamQuestions,
  startExam,
  submitExam,
} from "./studentAttempt.controller.js";

const router = Router();

// Add Student
router
  .route("/")
  .all(protect, authorizeRole("admin"))
  .post(isValid(addStudentSchema), addStudent)
  .get(getAllStudent);

router
  .route("/:id")
  .all(protect, authorizeRole("admin"))
  .get(getStudentById)
  .put(isValid(updateStudentSchema), updateStudent)
  .delete(isValid(deleteStudentSchema), deleteStudent);

// ====================== EXAM ===================
router.get(
  "/exams/available",
  protect,
  authorizeRole("student"),
  getAvailableExams
);

router
  .route("/exams/:examId/start")
  .all(protect, authorizeRole("student"))
  .post(isValid(examIdSchema), startExam);

router
  .route("/exams/attempts/:attemptId/questions")
  .all(protect, authorizeRole("student"))
  .get(isValid(getAttemptIdSchema), getExamQuestions);

router
  .route("/exams/attempts/:attemptId/submit")
  .all(protect, authorizeRole("student"))
  .post(isValid(examSubmitSchema), submitExam);

export default router;
