import ApiError from "../utils/error/ApiError.js";
import { Types } from "mongoose";
export const isValid = (schema) => {
  return (req, res, next) => {
    const copyReqObj = { ...req.body, ...req.params, ...req.query };

    const { error } = schema.validate(copyReqObj, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((err) => err.message);
      return next(new ApiError(400, messages));
    }

    next();
  };
};

// Custom validation for ObjectId
export const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid Object ID");
};
