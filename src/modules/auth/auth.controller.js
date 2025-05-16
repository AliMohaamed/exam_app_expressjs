import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { API_URL } from "../../constants.js";
import { generateActivationEmail } from "../../utils/generateHTML.js";
import { sendEmail } from "../../utils/sendMail.js";
export const register = asyncHandler(async (req, res, next) => {
  // data from body
  const { name, email, password } = req.body;
  // 2- check email if exist in db
  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ApiError(400, "Email already registered"));
  // 3- hash password
  const hashPassword = bcryptjs.hashSync(password, process.env.SlAT);
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
  const link = `${API_URL}/auth/confirmEmail/${activationCode}`;
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
