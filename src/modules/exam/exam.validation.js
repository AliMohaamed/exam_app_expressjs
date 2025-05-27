import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

// Create Exam Validation Schema
export const createExamSchema = Joi.object({
  subject: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Subject cannot be empty",
    "string.min": "Subject must be at least 3 characters long",
    "string.max": "Subject cannot exceed 100 characters",
    "any.required": "Subject is required",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  level: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .required()
    .messages({
      "any.only": "Invalid level",
      "any.required": "Level is required",
    }),
  duration: Joi.number().min(1).max(180).required().messages({
    "number.min": "Duration must be at least 1 minute",
    "number.max": "Duration cannot exceed 180 minutes",
    "any.required": "Duration is required",
  }),
}).required();

// Get Exam by ID Validation Schema
export const examIdSchema = Joi.object({
  examId: Joi.string().custom(isValidObjectId).required().messages({
    "string.custom": "Invalid exam ID format",
    "any.required": "Exam ID is required",
  }),
}).required();

// Update Exam Validation Schema
export const updateExamSchema = Joi.object({
  subject: Joi.string().optional().min(3).max(100).messages({
    "string.empty": "Subject cannot be empty",
    "string.min": "Subject must be at least 3 characters long",
    "string.max": "Subject cannot exceed 100 characters",
    "any.required": "Subject is required",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  level: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .optional()
    .messages({
      "any.only": "Invalid level",
    }),
  duration: Joi.number().min(1).max(180).optional().messages({
    "number.min": "Duration must be at least 1 minute",
    "number.max": "Duration cannot exceed 180 minutes",
  }),
  examId: Joi.string().custom(isValidObjectId).required().messages({
    "string.custom": "Invalid exam ID format",
    "any.required": "Exam ID is required",
  }),
}).required();
