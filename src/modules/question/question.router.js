import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import {
  bulkCreateQuestionSchema,
  createQuestionSchema,
  questionIdSchema,
  updateQuestionSchema,
} from "./question.validation.js";
import {
  bulkCreateQuestions,
  createQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestionsByExam,
  updateQuestion,
} from "./question.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .all(protect, authorizeRole("admin"))
  .post(isValid(createQuestionSchema), createQuestion)
  .get(getQuestionsByExam);

router
  .route("/:questionId")
  .all(protect, authorizeRole("admin"))
  .get(isValid(questionIdSchema), getQuestionById)
  .put(isValid(updateQuestionSchema), updateQuestion)
  .delete(isValid(questionIdSchema), deleteQuestion);

router.post(
  "/bulk",
  protect,
  authorizeRole("admin"),
  isValid(bulkCreateQuestionSchema),
  bulkCreateQuestions
);

export default router;
