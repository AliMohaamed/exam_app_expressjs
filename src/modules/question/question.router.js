import { Router } from "express";
import { authorizeRole, protect } from "../../middleware/auth.middleware.js";
import { createQuestionSchema } from "./question.validation.js";
import { createQuestion } from "./question.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";

const router = Router({ mergeParams: true });

// Create Question
router
  .route("/")
  .all(protect, authorizeRole("admin"))
  .post(isValid(createQuestionSchema), createQuestion);

export default router;
