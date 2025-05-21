import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";
import { EmailService } from "../../services/email.service.js";
import { AuthService } from "../../services/auth.service.js";
import { TokenService } from "../../services/token.service.js";
import { Token } from "../../../DB/models/token.model.js";
// Register
export const register = asyncHandler(async (req, res, next) => {
  // data from body
  const { name, email, password, level } = req.body;
  // 1- Register user using service
  let user;
  try {
    user = await AuthService.registerUser({ name, email, password, level });
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
  // 2- Send activation email
  const isSent = await EmailService.sendActivationEmail({
    email: user.email,
    activationCode: user.activationCode,
  });
  // 3- Respond
  return isSent
    ? sendResponse(res, { message: "Check Your Mail", data: user })
    : next(
        new ApiError(400, "User created but failed to send activation email")
      );
});

// Activate Mail
export const activateMail = asyncHandler(async (req, res, next) => {
  const { activationCode } = req.params;
  const user = await User.findOneAndUpdate(
    { activationCode },
    {
      isConfirmed: true,
      $unset: { activationCode: 1 },
    },
    { new: true }
  );
  if (!user)
    return next(new ApiError(400, "Invalid or expired activation link"));
  return sendResponse(res, { message: "Account Activated Successfully" });
});

// Login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // 1- Verify user using service
  let user;
  try {
    user = await AuthService.verifyUser(email, password);
  } catch (err) {
    return next(new ApiError(400, err.message));
  }
  // Tokens
  const token = await TokenService.generateAndSaveToken(
    user,
    req.headers["User-Agent"]
  );

  // change user status to online and save user in db
  user.status = "online";
  await user.save();
  return res.status(200).json({ message: "Login Successfully", token });
});

// Login
export const logout = asyncHandler(async (req, res, next) => {
  console.log(req.token);
  const tokenDB = await Token.findOneAndUpdate(
    { token: req.token, isValid: true },
    { isValid: false },
    { new: true }
  );
  if (!tokenDB)
    return next(new ApiError(400, "Token already invalidated or not found"));

  return sendResponse(res, { message: "Logged out successfully" });
});
