import Joi from "joi";

// Register
export const registerSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(20).required().messages({
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
  level: Joi.string()
    .required()
    .message({ "any.required": "Level is required." }),
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

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password does not match.",
    "any.required": "Confirm password is required.",
  }),
}).required();

// Activation Code
export const activateAccountSchema = Joi.object({
  activationCode: Joi.string().required().messages({
    "any.required": "activationCode is required.",
  }),
}).required();

// Login
export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),

  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
}).required();
