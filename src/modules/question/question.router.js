import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import { createQuestionSchema } from "./question.validation.js";
import { createQuestion, getQuestionsByExam } from "./question.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { idSchema } from "../exam/exam.validation.js";

const router = Router({ mergeParams: true });

// Create Question
router
  .route("/")
  .all(protect)
  .post(authorizeRole("admin"), isValid(createQuestionSchema), createQuestion)
  .get(isValid(idSchema), getQuestionsByExam);

export default router;
