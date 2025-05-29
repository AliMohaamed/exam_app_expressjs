import { Exam } from "../../DB/models/exam.model.js";
import { ExamAttempt } from "../../DB/models/examAttempt .js";
import { statsQuestion } from "../utils/question/questionUtils.js";

export const ExamService = {
  /**
   *
   * @desc    Get available exams for a student
   * @param   {Object} user - The user object containing student information
   * @return  {Promise<Object>} - An object containing the total number of available exams and the exams themselves
   * @access  Private (Student)
   */
  async getAvailableExamsForStudent(user) {
    const completedExamIds = await ExamAttempt.distinct("exam", {
      status: "submitted",
      student: user._id,
    });

    const exams = await Exam.find({
      level: user.level,
      _id: { $nin: completedExamIds },
    })
      .select("subject description level duration createdBy")
      .populate("createdBy", "name -_id")
      .populate("questions", "questionType points difficulty");

    const data = exams
      .filter((exam) => {
        const { questions } = exam.toObject();
        const stats = statsQuestion(questions);
        return stats.totalQuestions > 0;
      })
      .map((exam) => {
        const { questions, ...examWithoutQuestions } = exam.toObject();
        const stats = statsQuestion(questions);
        return {
          ...examWithoutQuestions,
          ...stats,
        };
      });

    return { total: data.length, exams: data };
  },
};
