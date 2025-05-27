import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import {
  addStudent,
  deleteStudent,
  getAllStudent,
  getAvailableExams,
  getStudentById,
  startExam,
  updateStudent,
} from "./student.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  addStudentSchema,
  deleteStudentSchema,
  updateStudentSchema,
} from "./student.validation.js";
import { examIdSchema } from "../exam/exam.validation.js";

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

// EXAM
router.get(
  "/exams/available",
  protect,
  authorizeRole("student"),
  getAvailableExams
);

router
  .route("/exams/:examId/start")
  .all(protect, authorizeRole("student"))
  .get(isValid(examIdSchema), startExam);

export default router;
