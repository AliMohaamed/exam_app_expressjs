import { Router } from "express";
import {
  register,
  activateMail,
  login,
  logout,
  forgetPassword,
  verifyOtp,
  resetPassword,
} from "./auth.controller.js";
import {
  activateAccountSchema,
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "./auth.validation.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = Router();

// Register
router.post("/register", isValid(registerSchema), register);

// Activate Mail
router.get(
  "/confirmEmail/:activationCode",
  isValid(activateAccountSchema),
  activateMail
);
// Register
router.post("/login", isValid(loginSchema), login);

// Logout
router.post("/logout", protect, logout);

// Forget Password
router.post("/forgetPassword", isValid(forgetPasswordSchema), forgetPassword);
router.post("/verifyOtp", isValid(verifyOtpSchema), verifyOtp);
router.post("/resetPassword", isValid(resetPasswordSchema), resetPassword);

export default router;
