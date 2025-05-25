import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import {
  createQuestionSchema,
  questionIdSchema,
  updateQuestionSchema,
} from "./question.validation.js";
import {
  createQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestionsByExam,
  updateQuestion,
} from "./question.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { idSchema } from "../exam/exam.validation.js";

const router = Router({ mergeParams: true });

// Create Question And Get
router
  .route("/")
  .all(protect)
  .post(authorizeRole("admin"), isValid(createQuestionSchema), createQuestion)
  .get(isValid(idSchema), getQuestionsByExam);

router
  .route("/:questionId")
  .all(protect)
  .get(isValid(questionIdSchema), getQuestionById)
  .put(isValid(updateQuestionSchema), updateQuestion)
  .delete(isValid(questionIdSchema), deleteQuestion);

export default router;
