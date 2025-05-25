import { Question } from "../../../DB/models/question.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/response.js";

export const createQuestion = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;

  const question = await Question.create({
    ...req.body,
    exam: examId,
  });
  if (!question) return next(new ApiError(400, "Can not create question"));

  sendResponse(res, {
    statusCode: 201,
    data: question,
    message: "Created Question Successfully",
  });
});
