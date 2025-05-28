import { Question } from "../../DB/models/question.model.js";

export const AttemptService = {
  /**
   * Auto-grades the submitted exam attempt.
   * @param {Object} attempt - Mongoose document for ExamAttempt (populated with exam).
   * @param {Array} submittedAnswers - Array of submitted answers { question, answer }
   */
  async gradeAttempt(attempt, submittedAnswers) {
    const questions = await Question.find({ exam: attempt.exam._id });

    let totalScore = 0;
    const gradedAnswers = [];

    // Step 1: Remove duplicate question answers, keeping the latest one
    const uniqueAnswersMap = new Map();
    for (const ans of submittedAnswers) {
      uniqueAnswersMap.set(ans.questionId.toString(), ans.answer);
    }

    // Step 2: Grade each unique answer
    for (const [questionId, answer] of uniqueAnswersMap.entries()) {
      const question = questions.find((q) => {
        return q._id.toString() === questionId;
      });

      if (!question) continue;

      let isCorrect = false;

      switch (question.questionType) {
        case "multiple-choice": {
          const correctOption = question.options.find((opt) => opt.isCorrect);
          isCorrect = correctOption?.text === answer;
          break;
        }
        case "true-false":
          isCorrect = question.correctAnswer === answer;
          break;

        case "fill-blank":
          isCorrect =
            String(question.correctText).trim().toLowerCase() ===
            String(answer).trim().toLowerCase();
          break;
      }

      gradedAnswers.push({
        question: question._id,
        answer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
      });

      if (isCorrect) totalScore += question.points;
    }

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Number(
      (totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0).toFixed(2)
    );

    attempt.answers = gradedAnswers;
    attempt.totalScore = totalScore;
    attempt.percentage = percentage;
  },
};
