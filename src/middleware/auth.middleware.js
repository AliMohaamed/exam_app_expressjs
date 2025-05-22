import { Token } from "../../DB/models/token.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/error/ApiError.js";

import jwt from "jsonwebtoken";
import { User } from "../../DB/models/user.model.js";

export const protect = asyncHandler(async (req, res, next) => {
  // 1. Read token from Authorization header
  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader);
  if (!authHeader?.startsWith(`${process.env.BEARERKEY}`)) {
    return next(new ApiError(401, "Access denied. No token provided."));
  }

  const token = authHeader.split(" ")[1];

  // 2. Verify JWT
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token."));
  }

  // 3. Check token existence in DB
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new ApiError(401, "Token not found or expired."));

  // 4. Check user
  const user = await User.findById(decoded.id);
  if (!user) return next(new ApiError(404, "User not found."));

  // 5. Attach user to request
  req.user = user;
  req.token = token;
  next();
});

export const authorizeRole = (role) => {
  return asyncHandler(async (req, res, next) => {
    // Check if user has the required role
    if (req.user.role !== role)
      return next(
        new ApiError(
          403,
          "Access denied. You do not have permission to perform this action."
        )
      );

    next();
  });
};
