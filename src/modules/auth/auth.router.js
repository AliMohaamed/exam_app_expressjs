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

router.post("/register", isValid(registerSchema), register);

router.get(
  "/confirmEmail/:activationCode",
  isValid(activateAccountSchema),
  activateMail
);

router.post("/login", isValid(loginSchema), login);

router.post("/logout", protect, logout);

router.post("/forgetPassword", isValid(forgetPasswordSchema), forgetPassword);

router.post("/verifyOtp", isValid(verifyOtpSchema), verifyOtp);

router.post("/resetPassword", isValid(resetPasswordSchema), resetPassword);

export default router;
