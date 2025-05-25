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
      new RegExp(
        "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{3,30}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 3-30 characters long, contain at least one letter, one number and one special character (!@#$%^&*).",
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
      new RegExp(
        "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"
      )
    )
    .optional(),
  // level: Joi.string().valid("beginner", "intermediate", "advanced").optional(),
  level: Joi.string().optional(),
}).required();

export const deleteStudentSchema = Joi.object({
  id: Joi.string().custom(isValidObjectId).required(),
}).required();
