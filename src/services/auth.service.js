import { User } from "../../DB/models/user.model.js";
import { checkPassword, createHashedPassword } from "../utils/hashPassword.js";
import crypto from "crypto";

export const AuthService = {
  // Register
  async registerUser({ name, email, password, level }) {
    // check email if exist in db
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already registered");
    // generate activation code
    const activationCode = crypto.randomBytes(64).toString("hex");
    // create user in db
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      level,
      activationCode,
    });
    return user;
  },
  // Verify User
  async verifyUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = checkPassword(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    return user;
  },
  async verifyUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    if (!user.isConfirmed) {
      throw new Error("Account not activated");
    }

    const isMatch = checkPassword(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    return user;
  },
  // Logout
};
