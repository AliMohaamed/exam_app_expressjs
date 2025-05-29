import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const getAttemptIdSchema = Joi.object({
  attemptId: Joi.string().custom(isValidObjectId).required(),
}).required();

export const examSubmitSchema = Joi.object({
  attemptId: Joi.string().custom(isValidObjectId).required(),
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().custom(isValidObjectId).required(),
        answer: Joi.alternatives().try(Joi.string(), Joi.boolean()).required(),
      })
    )
    .required(),
}).required();
