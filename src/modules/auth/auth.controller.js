import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { API_URL, FE_URL } from "../../constants.js";
import { generateActivationEmail } from "../../utils/generateHTML.js";
import { sendEmail } from "../../utils/sendMail.js";
import {
  checkPassword,
  createHashedPassword,
} from "../../utils/hashPassword.js";
import { Token } from "../../../DB/models/token.model.js";
import { generateExpiryDate } from "../../utils/generateExpiryDate.js";
// Register
export const register = asyncHandler(async (req, res, next) => {
  // data from body
  const { name, email, password } = req.body;
  // 2- check email if exist in db
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ApiError(400, "Email already registered"));
  // 3- hash password
  const hashPassword = await createHashedPassword(password);
  // 4- generate activation code
  const activationCode = crypto.randomBytes(64).toString("hex");
  // 5- create user in db
  const user = await User.create({
    name,
    email,
    password: hashPassword,
    activationCode,
  });
  // 6- create confirmation Link
  // const link = `${FE_URL}/auth/confirmEmail/${activationCode}`; // Front
  const link = `${API_URL}/api/auth/confirmEmail/${activationCode}`; // Test
  // 7- Send mail
  const isSent = await sendEmail({
    to: user.email,
    subject: "Activate Account",
    html: generateActivationEmail(link),
  });
  // 8- response
  return isSent
    ? sendResponse(res, { message: "Check Your Mail", data: user })
    : next(
        new ApiError(
          400,
          "Registration succeeded but failed to send confirmation email"
        )
      );
});

// Activate Mail
export const activateMail = asyncHandler(async (req, res, next) => {
  console.log("TEST");
  // data
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
  // check email
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(400, "Email Or Password is invalid"));

  // check isConfirmed
  if (!user.isConfirmed) {
    const link = `${API_URL}/api/auth/confirmEmail/${user.activationCode}`;
    await sendEmail({
      to: user.email,
      subject: "Activate Account",
      html: generateActivationEmail(link),
    });
    return next(
      new ApiError(
        400,
        "Account not activated. A new activation link has been sent."
      )
    );
  }

  // check password
  const isMatch = checkPassword(password, user.password);
  if (!isMatch) return next(new ApiError(400, "Email Or Password is invalid"));

  // generate token
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2d",
    }
  );
  // save token in token model
  await Token.create({
    token,
    user: user._id,
    isValid: true,
    agent: req.headers["User-Agent"],
    expireAt: generateExpiryDate(2, "days"),
  });
  // change user status to online and save user in db
  user.status = "online";

  return sendResponse(res, { message: "Login Successfully", data: { token } });
});
