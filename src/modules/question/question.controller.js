import { Question } from "../../../DB/models/question.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/response.js";

export const createQuestion = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  // Check if exam exists
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }
  // Check if user is the creator of the exam or admin
  if (
    exam.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to add questions to this exam");
  }
  const question = await Question.create({
    ...req.body,
    exam: examId,
  });
  if (!question) return next(new ApiError(400, "Can not create question"));

  sendResponse(res, {
    statusCode: 201,
    data: question,
    message: "Question created successfully",
  });
});
