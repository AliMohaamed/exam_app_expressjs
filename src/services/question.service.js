import { Question } from "../../DB/models/question.model.js";
import { isOwnerOrAdmin } from "../utils/auth/auth.js";
import ApiError from "../utils/error/ApiError.js";
import { isQuestionTypeChanged } from "../utils/question/questionUtils.js";

export const QuestionService = {
  async updateQuestionService({ examId, questionId, user, data }) {
    const question = await Question.findOne({
      _id: questionId,
      exam: examId,
    }).populate("exam");

    if (!question) throw new ApiError(404, "Question not found in this exam");

    // Check if user is the creator of the exam or admin
    if (!isOwnerOrAdmin(user, question.exam.createdBy)) {
      throw new ApiError(403, "Not authorized");
    }

    // Validate question type change
    if (isQuestionTypeChanged(question.questionType, data.questionType)) {
      throw new ApiError(400, "Cannot change question type after creation");
    }

    Object.assign(question, data);
    await question.save();

    return await Question.findById(questionId).populate(
      "exam",
      "subject level"
    );
  },
  async deleteQuestionService({ examId, questionId, user }) {
    const question = await Question.findOne({
      _id: questionId,
      exam: examId,
    }).populate("exam");
    if (!question) throw new ApiError(404, "Question not found in this exam");

    // Check if user is the creator of the exam or admin
    if (!isOwnerOrAdmin(user, question.exam.createdBy)) {
      throw new ApiError(403, "Not authorized");
    }

    await Question.findByIdAndDelete(questionId);
    return { message: "Question deleted successfully" };
  },
};
