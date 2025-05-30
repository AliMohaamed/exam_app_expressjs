import Joi from "joi";

// Register
export const registerSchema = Joi.object({
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
  level: Joi.string().required().messages({
    "any.required": "Level is required.",
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

// Forget Password
export const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
}).required();

// verifyOtp
export const verifyOtpSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits long.",
    "any.required": "OTP is required.",
  }),
}).required();

// Reset Password
export const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits long.",
    "any.required": "OTP is required.",
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

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password does not match.",
    "any.required": "Confirm password is required.",
  }),
}).required();
