import { Exam } from "../../../DB/models/exam.model.js";
import { ExamAttempt } from "../../../DB/models/examAttempt .js";
import { Question } from "../../../DB/models/question.model.js";
import { AttemptService } from "../../services/attempt.service.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/handlers/asyncHandler.js";
import sendResponse from "../../utils/response.js";

// @desc    Get available exams for student
// @route   GET /api/student/exams/available
// @access  Private (Student)
export const getAvailableExams = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const studentLevel = req.user.level;

  const completedExamIds = await ExamAttempt.distinct("exam", {
    status: "submitted",
    student: studentId,
  });

  const availableExams = await Exam.find({
    level: studentLevel,
    _id: { $nin: completedExamIds },
  })
    .select("subject description level duration createdBy")
    .populate("createdBy", "name -_id");

  sendResponse(res, {
    message: "All Exams Available For This Student",
    data: {
      total: availableExams.length,
      exams: availableExams,
    },
  });
});

// @desc    Start an exam
// @route   POST /api/student/exams/:examId/start
// @access  Private (Student)
export const startExam = asyncHandler(async (req, res, next) => {
  const { examId } = req.params;
  const studentId = req.user._id;
  const studentLevel = req.user.level;
  const exam = await Exam.findOne({
    _id: examId,
    level: studentLevel,
  }).populate("questions");

  if (!exam) {
    return next(
      new ApiError(404, "This exam is not available or has no questions")
    );
  }

  if (!exam.questions || exam.questions.length === 0) {
    return next(new ApiError(400, "This exam has no questions yet"));
  }

  const existingAttempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
  });

  if (existingAttempt) {
    return existingAttempt.status === "in-progress"
      ? next(new ApiError(400, "You already started this exam"))
      : next(new ApiError(400, "Already submitted this exam"));
  }

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + exam.duration * 60 * 1000);

  const attempt = await ExamAttempt.create({
    student: studentId,
    exam: examId,
    startTime,
    endTime,
  });
  sendResponse(res, {
    statusCode: 201,
    message: "Exam started successfully",
    data: {
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
    },
  });
});

// @desc    Get exam questions for student
// @route   GET /api/student/exams/attempts/:attemptId/questions
// @access  Private (Student)
export const getExamQuestions = asyncHandler(async (req, res, next) => {
  const { attemptId } = req.params;
  // 1 Get the exam attempt by ID and ensure it belongs to the student
  const attempt = await ExamAttempt.findOne({
    _id: attemptId,
    student: req.user._id,
  }).populate("exam");
  if (!attempt)
    return next(
      new ApiError(404, "You are not allowed to access this attempt")
    );

  if (attempt.status !== "in-progress")
    return next(
      new ApiError(400, "You can only view questions for in-progress attempts")
    );
  // 2 Check if the exam time has expired
  const now = Date.now();
  const examEndTime =
    attempt.endTime ||
    attempt.startTime.getTime() + attempt.questions[0].exam.duration * 60;
  if (now > examEndTime) {
    // The Time has expired, end the exam automatically
    attempt.status = "auto-submitted";
    attempt.endTime = Date.now();
    attempt.timeSpent = Math.floor((now - attempt.startTime) / 1000);
    await attempt.save();
    return next(new ApiError(400, "Exam time has expired"));
  }
  // 3 Fetch the questions for the exam associated with the attempt
  const questions = await Question.find({ exam: attempt.exam }).select(
    "-correctAnswer -modelAnswer -correctText -options.isCorrect"
  );
  //
  // 4 Format the questions without answers or data not needed for the student
  const formattedQuestions = questions.map((question) => {
    const questionData = {
      _id: question._id,
      questionText: question.questionText,
      questionType: question.questionType,
      points: question.points,
      difficulty: question.difficulty,
    };

    if (question.questionType === "multiple-choice") {
      questionData.options = question.options.map((option) => ({
        _id: option._id,
        text: option.text,
      }));
    } else if (question.questionType === "true-false") {
      questionData.isTrueFalse = true;
    } else if (question.questionType === "essay") {
      questionData.isEssay = true;
    } else if (question.questionType === "fill-blank") {
      questionData.isFillBlank = true;
    }

    return questionData;
  });

  sendResponse(res, {
    message: "Exam questions retrieved successfully",
    data: {
      total: questions.length,
      attemptId: attempt._id,
      questions: formattedQuestions,
      exam: {
        subject: attempt.exam.subject,
        duration: attempt.exam.duration,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
      },
    },
  });
});

// @desc    Submit exam (final submission)
// @route   POST /api/student/exams/attempts/:attemptId/submit
// @access  Private (Student)
export const submitExam = asyncHandler(async (req, res, next) => {
  const { attemptId } = req.params;
  const { answers } = req.body;

  const attempt = await ExamAttempt.findOne({
    _id: attemptId,
    student: req.user._id,
  }).populate("exam", "subject description level duration");

  if (!attempt) return next(new ApiError(404, "Attempt not found"));

  if (attempt.status !== "in-progress")
    return next(new ApiError(400, "You have already submitted this exam"));

  // Time expire
  const now = Date.now();
  const examEndTime =
    attempt.endTime ||
    new Date(attempt.startTime.getTime() + attempt.exam.duration * 60 * 1000);

  if (now > examEndTime) {
    await AttemptService.gradeAttempt(attempt, answers);
    attempt.status = "auto-submitted";
    attempt.endTime = new Date();
    attempt.timeSpent = Math.floor((now - attempt.startTime) / 1000);
    await attempt.save();
    return next(
      new ApiError(
        400,
        "Exam time has expired, your answers were auto-submitted"
      )
    );
  }

  await AttemptService.gradeAttempt(attempt, answers);

  attempt.status = "submitted";
  attempt.endTime = new Date();
  attempt.timeSpent = Math.floor((now - attempt.startTime) / 1000);

  await attempt.save();
  sendResponse(res, {
    message: "Exam submitted successfully",
    data: attempt,
  });
});
