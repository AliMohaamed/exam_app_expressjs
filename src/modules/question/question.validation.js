import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

// Create Question Validation Schema
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

// Get Question by ID Validation Schema
export const questionIdSchema = Joi.object({
  examId: Joi.string().custom(isValidObjectId).required().messages({
    "string.custom": "Invalid exam ID format",
    "any.required": "Exam ID is required",
  }),
  questionId: Joi.string().custom(isValidObjectId).required().messages({
    "string.custom": "Invalid question ID format",
    "any.required": "Question ID is required",
  }),
}).required();

// update question validation schema
export const updateQuestionSchema = Joi.object({
  questionText: Joi.string().min(10).max(500),
  questionType: Joi.string().valid(
    "multiple-choice",
    "true-false",
    "essay",
    "fill-blank"
  ),
  options: Joi.when("questionType", {
    is: "multiple-choice",
    then: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().required(),
          isCorrect: Joi.boolean().required(),
        })
      )
      .min(2),
    otherwise: Joi.forbidden(),
  }),
  correctAnswer: Joi.when("questionType", {
    is: "true-false",
    then: Joi.boolean(),
    otherwise: Joi.forbidden(),
  }),
  modelAnswer: Joi.when("questionType", {
    is: "essay",
    then: Joi.string().max(1000),
    otherwise: Joi.forbidden(),
  }),
  correctText: Joi.when("questionType", {
    is: "fill-blank",
    then: Joi.string(),
    otherwise: Joi.forbidden(),
  }),
  points: Joi.number().min(1).max(10),
  difficulty: Joi.string().valid("easy", "medium", "hard"),
  examId: Joi.string().custom(isValidObjectId).required(),
  questionId: Joi.string().custom(isValidObjectId).required(),
}).required();
