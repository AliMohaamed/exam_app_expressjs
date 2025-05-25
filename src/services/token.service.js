import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
import { generateExpiryDate } from "../utils/generateExpiryDate.js";

export const TokenService = {
  async generateAndSaveToken(user, agent) {
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
      agent,
      expireAt: generateExpiryDate(5, "days"),
    });
    return token;
  },
};
