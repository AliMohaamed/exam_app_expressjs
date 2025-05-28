import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const addStudentSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "string.alphanum": "Name must contain only alphanumeric characters.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 30 characters.",
    "any.required": "Name is required.",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$")
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character (#?!@$%^&*-).",
      "any.required": "Password is required.",
    }),

  level: Joi.string().required().messages({
    "any.required": "Level is required.",
  }),
}).required();

export const updateStudentSchema = Joi.object({
  id: Joi.string().custom(isValidObjectId).required(),
  name: Joi.string().min(3).max(20).optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
    .optional(),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$")
    )
    .optional(),
  // level: Joi.string().valid("beginner", "intermediate", "advanced").optional(),
  level: Joi.string().optional(),
}).required();

export const deleteStudentSchema = Joi.object({
  id: Joi.string().custom(isValidObjectId).required(),
}).required();

// ====================== EXAM ===================
export const getAttemptIdSchema = Joi.object({
  attemptId: Joi.string().custom(isValidObjectId).required(),
}).required();

export const examSubmitSchema = Joi.object({
  attemptId: Joi.string().custom(isValidObjectId).required(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().custom(isValidObjectId).required(),
        answer: Joi.alternatives().try(Joi.string(), Joi.boolean()).required(),
      })
    )
    .required(),
}).required();
