import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import {
  addStudent,
  deleteStudent,
  getAllStudent,
  getProfile,
  getStudentById,
  updateStudent,
} from "./student.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  addStudentSchema,
  deleteStudentSchema,
  updateStudentSchema,
} from "./student.validation.js";

const router = Router();

// Add Student Or Get All Students
router
  .route("/")
  .all(protect, authorizeRole("admin"))
  .post(isValid(addStudentSchema), addStudent)
  .get(getAllStudent);

router.get("/profile", protect, authorizeRole("student"), getProfile);

router
  .route("/:id")
  .all(protect, authorizeRole("admin"))
  .get(getStudentById)
  .put(isValid(updateStudentSchema), updateStudent)
  .delete(isValid(deleteStudentSchema), deleteStudent);

export default router;
