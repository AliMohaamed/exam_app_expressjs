import { User } from "../../DB/models/user.model.js";
import { generateExpiryDate } from "../utils/generateExpiryDate.js";
import { checkPassword } from "../utils/hashPassword.js";
import crypto from "crypto";
import randomstring from "randomstring";
import { sendEmail } from "../utils/sendMail.js";
import { resetPasswordTemp } from "../utils/generateHTML.js";
import ApiError from "../utils/error/ApiError.js";
import { th } from "date-fns/locale";

export const AuthService = {
  // Register
  async registerUser({ name, email, password, level }) {
    // check email if exist in db
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(400, "Email already exists");
    // generate activation code
    const activationCode = crypto.randomBytes(64).toString("hex");
    // create user in db
    const user = await User.create({
      name,
      email,
      password,
      level,
      activationCode,
    });
    return user;
  },
  // Verify login credentials
  async verifyUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "Invalid email or password");

    const isMatch = checkPassword(password, user.password);
    if (!isMatch) throw new ApiError(400, "Invalid email or password");

    return user;
  },
  // Forget Password if user forget password
  async forgetPassword(email) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "Email not found");

    const otp = randomstring.generate({ length: 6, charset: "numeric" });
    const otpExpires = generateExpiryDate(1, "minutes");

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const html = resetPasswordTemp(otp);
    const sent = await sendEmail({
      to: user.email,
      subject: "Reset Password",
      html,
    });
    if (!sent) throw new ApiError(400, "Failed to send email");

    return true;
  },
  // Reusable OTP validation
  async validateOtp(email, otp) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(400, "Email not found");

    if (!user.otp || !user.otpExpires)
      throw new ApiError(400, "OTP not found or expired");

    if (user.otp !== otp) throw new ApiError(400, "Invalid OTP");

    if (user.otpExpires < Date.now()) throw new ApiError(400, "OTP expired");

    return user;
  },
};
