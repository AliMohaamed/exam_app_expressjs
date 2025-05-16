import { Router } from "express";
import { register, activateMail, login } from "./auth.controller.js";
import {
  activateAccountSchema,
  loginSchema,
  registerSchema,
} from "./auth.validation.js";
import { isValid } from "../../middleware/validation.middleware.js";

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

export default router;
