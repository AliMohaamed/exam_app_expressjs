import { Router } from "express";
import { register } from "./auth.controller.js";
import { registerSchema } from "./auth.validation.js";
import { isValid } from "../../middleware/validation.middleware.js";

const router = Router();

router.post("/register", isValid(registerSchema), register);

export default router;
