import ApiError from "../utils/error/ApiError.js";

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
