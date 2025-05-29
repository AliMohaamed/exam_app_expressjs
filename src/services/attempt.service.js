import { Exam } from "../../DB/models/exam.model.js";
import { ExamAttempt } from "../../DB/models/attempt.model.js";
import { Question } from "../../DB/models/question.model.js";
import ApiError from "../utils/error/ApiError.js";
import { formatQuestions } from "../utils/formatUtils.js";
import { isExamExpired } from "../utils/generateExpiryDate.js";

export const AttemptService = {
  /**
   * Retrieves all available exams for a student.
   * @param {Object} student - Mongoose document for Student.
   * @returns {Array} List of available exams.
   */
  async startExam(user, examId) {
    const exam = await Exam.findOne({
      _id: examId,
      level: user.level,
    }).populate("questions");
    if (!exam)
      throw new ApiError(404, "This exam is not available or has no questions");

    if (!exam.questions || exam.questions.length === 0)
      throw new ApiError(400, "This exam has no questions yet");

    const existingAttempt = await ExamAttempt.findOne({
      student: user._id,
      exam: examId,
    });
    if (existingAttempt)
      throw new ApiError(
        400,
        existingAttempt.status === "in-progress"
          ? "Already started"
          : "Already submitted"
      );

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + exam.duration * 60 * 1000);

    const attempt = await ExamAttempt.create({
      student: user._id,
      exam: examId,
      startTime,
      endTime,
    });

    return {
      attemptId: attempt._id,
      exam: {
        subject: exam.subject,
        duration: exam.duration,
        level: exam.level,
        questionsCount: exam.questions.length,
        totalMarks: exam.questions.reduce((total, q) => total + q.points, 0),
        startTime,
        endTime,
      },
    };
  },
  /**
   * Retrieves the questions for an exam attempt.
   * @param {Object} user - Mongoose document for Student.
   * @param {String} attemptId - ID of the exam attempt.
   * @returns {Object} Contains total questions, attempt ID, formatted questions, and exam details.
   */
  async getQuestions(user, attemptId) {
    const attempt = await ExamAttempt.findOne({
      _id: attemptId,
    }).populate("exam");
    if (!attempt) throw new ApiError(404, "Attempt not found");

    if (attempt.student.toString() !== user._id.toString())
      throw new ApiError(403, "Unauthorized access to this attempt");

    if (attempt.status !== "in-progress")
      throw new ApiError(
        400,
        "You can only view questions for in-progress attempts"
      );

    if (isExamExpired(attempt)) {
      attempt.status = "auto-submitted";
      attempt.endTime = new Date();
      attempt.timeSpent = Math.floor((Date.now() - attempt.startTime) / 1000);
      await attempt.save();
      throw new ApiError(400, "Exam expired, answers auto-submitted");
    }

    const questions = await Question.find({ exam: attempt.exam }).select(
      "-correctAnswer -modelAnswer -correctText -options.isCorrect"
    );
    return {
      total: questions.length,
      attemptId: attempt._id,
      questions: formatQuestions(questions),
      exam: {
        subject: attempt.exam.subject,
        duration: attempt.exam.duration,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
      },
    };
  },
  /**
   * Submits the exam attempt with answers.
   * @param {Object} user - Mongoose document for Student.
   * @param {String} attemptId - ID of the exam attempt.
   * @param {Array} answers - Array of submitted answers { questionId, answer }.
   * @returns {Object} The updated exam attempt with graded answers and score.
   * */
  async submitExam(user, attemptId, answers) {
    const attempt = await ExamAttempt.findOne({
      _id: attemptId,
      student: user._id,
    }).populate("exam");
    if (!attempt) throw new ApiError(404, "Attempt not found");

    if (attempt.status !== "in-progress")
      throw new ApiError(400, "Already submitted");

    if (isExamExpired(attempt)) {
      await this.gradeAttempt(attempt, answers);
      attempt.status = "auto-submitted";
      attempt.endTime = new Date();
      attempt.timeSpent = Math.floor((Date.now() - attempt.startTime) / 1000);
      await attempt.save();
      throw new ApiError(400, "Exam expired, answers auto-submitted");
    }

    await this.gradeAttempt(attempt, answers);
    attempt.status = "submitted";
    attempt.endTime = new Date();
    attempt.timeSpent = Math.floor((Date.now() - attempt.startTime) / 1000);
    await attempt.save();
    return attempt;
  },
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
  /**
   * Retrieves the exam result for a specific attempt
   * @param {String} studentId - ID of the student.
   * @param {String} attemptId - ID of the exam attempt.
   * @return {Object} The exam result including attempt details and answers.
   * */
  async getExamResult(studentId, attemptId) {
    const attempt = await ExamAttempt.findOne({
      _id: attemptId,
      student: studentId,
    }).populate("exam", "subject duration");
    console.log(attemptId, studentId);
    if (!attempt) throw new ApiError(404, "Attempt not found");

    if (!["submitted", "auto-submitted"].includes(attempt.status)) {
      throw new ApiError(
        400,
        "The exam is not finished yet. Please submit first."
      );
    }

    return {
      attemptId: attempt._id,
      totalScore: attempt.totalScore,
      percentage: attempt.percentage,
      status: attempt.status,
      timeSpent: attempt.timeSpent,
      isPassed: attempt.isPassed,
      exam: {
        subject: attempt.exam.subject,
        duration: attempt.exam.duration,
      },
      answers: attempt.answers,
    };
  },
  /**
   * Retrieves all exam results for a student.
   * @param {String} studentId - ID of the student.
   * @return {Array} List of exam results with attempt details and answers.
   * */
  async getAllResultsForStudent(studentId) {
    const attempts = await ExamAttempt.find({
      student: studentId,
      status: { $in: ["submitted", "auto-submitted"] },
    }).populate("exam", "subject level");

    if (!attempts || attempts.length === 0) {
      throw new ApiError(
        404,
        "No exam results found for your account. You haven't taken any exams yet."
      );
    }

    return attempts.map((a) => ({
      attemptId: a._id,
      totalScore: a.totalScore,
      percentage: a.percentage,
      status: a.status,
      timeSpent: a.timeSpent,
      isPassed: a.isPassed,
      exam: {
        subject: a.exam.subject,
        duration: a.exam.duration,
      },
      answers: a.answers,
    }));
  },
  /* ==================Admin===================== */
  async getAllAttempts(obj) {
    const { status } = obj;
    const filters = {};
    if (status) filters.status = status;
    const attempts = await ExamAttempt.find(filters)
      .populate({
        path: "exam",
        select: "subject level duration",
        populate: {
          path: "createdBy",
          select: "name -_id",
        },
      })
      .populate("student", "name email level status profileImage.secure_url");

    return {
      totalAttempt: attempts.length,
      attempts,
    };
  },
};
