import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createQuestionSchema = Joi.object({
  questionText: Joi.string().min(10).max(500).required(),
  questionType: Joi.string()
    .valid("multiple-choice", "true-false", "essay", "fill-blank")
    .required(),
  options: Joi.when("questionType", {
    is: "multiple-choice",
    then: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().required(),
          isCorrect: Joi.boolean().required(),
        })
      )
      .min(2)
      .required(),
    otherwise: Joi.forbidden(),
  }),
  correctAnswer: Joi.when("questionType", {
    is: "true-false",
    then: Joi.boolean().required(),
    otherwise: Joi.forbidden(),
  }),
  modelAnswer: Joi.when("questionType", {
    is: "essay",
    then: Joi.string().max(1000).required(),
    otherwise: Joi.forbidden(),
  }),
  correctText: Joi.when("questionType", {
    is: "fill-blank",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  points: Joi.number().min(1).max(10).default(1),
  difficulty: Joi.string().valid("easy", "medium", "hard").default("medium"),
  examId: Joi.string().custom(isValidObjectId).required(),
});
