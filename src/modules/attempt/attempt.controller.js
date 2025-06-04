import { ExamAttempt } from "../../../DB/models/attempt.model.js";
import { Exam } from "../../../DB/models/exam.model.js";
import { AttemptService } from "../../services/attempt.service.js";
import { ExamService } from "../../services/exam.service.js";
import APIFeatures from "../../utils/apiFeatures.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/handlers/asyncHandler.js";
import sendResponse from "../../utils/response.js";

export const getAvailableExams = asyncHandler(async (req, res) => {
  const exams = await ExamService.getAvailableExamsForStudent(req.user);
  sendResponse(res, {
    message: "All Exams Available For This Student",
    data: exams,
  });
});

export const startExam = asyncHandler(async (req, res) => {
  const result = await AttemptService.startExam(req.user, req.params.examId);
  sendResponse(res, { message: "Exam started", data: result });
});

export const getExamQuestions = asyncHandler(async (req, res) => {
  const questions = await AttemptService.getQuestions(
    req.user,
    req.params.attemptId
  );
  sendResponse(res, {
    message: "Exam questions retrieved successfully",
    data: questions,
  });
});

export const submitExam = asyncHandler(async (req, res) => {
  const result = await AttemptService.submitExam(
    req.user,
    req.params.attemptId,
    req.body.answers
  );
  sendResponse(res, { message: "Exam submitted successfully", data: result });
});

export const getExamResult = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const result = await AttemptService.getExamResult(req.user._id, attemptId);
  sendResponse(res, { message: "The Result For Attempt", data: result });
});

export const getAllResultsForStudent = asyncHandler(async (req, res) => {
  const result = await AttemptService.getAllResultsForStudent(req.user._id);
  sendResponse(res, { message: "All Results For This Student", data: result });
});

/*
 * Admin Routes
 */
// export const getAllAttempts = asyncHandler(async (req, res) => {
// const results = await AttemptService.getAllAttempts(req.query);
//   res.json({ results });
// });

export const getAllAttempts = asyncHandler(async (req, res, next) => {
  const { q, subject, student, status, isPassed, fromDate, toDate } = req.query;

  let matchConditions = {};

  if (status) matchConditions.status = status;

  if (isPassed !== undefined) {
    matchConditions.percentage = {
      $gte: isPassed === "true" ? 60 : 0,
      $lt: isPassed === "true" ? 100 : 60,
    };
  }

  if (fromDate || toDate) {
    matchConditions.createdAt = {};
    if (fromDate) matchConditions.createdAt.$gte = new Date(fromDate);
    if (toDate) matchConditions.createdAt.$lte = new Date(toDate);
  }

  const pipeline = [
    {
      $lookup: {
        from: "exams",
        localField: "exam",
        foreignField: "_id",
        as: "exam",
      },
    },
    { $unwind: "$exam" },
    {
      $lookup: {
        from: "users",
        localField: "student",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    {
      $addFields: {
        isPassed: { $gte: ["$percentage", 60] },
      },
    },
    { $match: matchConditions },
  ];

  if (q) {
    const regex = new RegExp(q, "i");
    pipeline.push({
      $match: {
        $or: [{ "student.name": regex }, { "exam.subject": regex }],
      },
    });
  }

  // total count before pagination
  const countPipeline = [...pipeline, { $count: "total" }];
  const totalResult = await ExamAttempt.aggregate(countPipeline);
  const totalAttemptsCount = totalResult[0]?.total || 0;

  // pagination logic
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const totalPages = Math.ceil(totalAttemptsCount / limit);

  // get paginated results
  const apiFeatures = new APIFeatures(
    ExamAttempt.aggregate(pipeline),
    req.query
  ).paginate();

  const results = await apiFeatures.query;
  let totalPercentage = results.reduce((sum, cur) => sum + cur.percentage, 0);
  let avgScore =
    results.length > 0
      ? Number((totalPercentage / results.length).toFixed(2))
      : 0;

  // get total exams count from same conditions
  const examIdSetPipeline = [
    ...pipeline,
    {
      $group: {
        _id: "$exam._id",
      },
    },
    {
      $count: "totalExams",
    },
  ];

  const totalExamsResult = await ExamAttempt.aggregate(examIdSetPipeline);
  const totalExams = totalExamsResult[0]?.totalExams || 0;

  // total students
  const studentIdSetPipeline = [
    ...pipeline,
    { $group: { _id: "$student._id" } },
    { $count: "totalStudents" },
  ];
  const totalStudentsResult = await ExamAttempt.aggregate(studentIdSetPipeline);
  const totalStudents = totalStudentsResult[0]?.totalStudents || 0;

  if (!results || results.length === 0)
    return next(new ApiError(404, "No Attempts"));

  sendResponse(res, {
    message: "Exam Attempts Retrieved Successfully",
    data: {
      totalAttempts: results.length,
      totalPages,
      avgScore,
      totalExams,
      totalStudents,
      page: parseInt(req.query.page) || 1,
      attempts: results,
    },
  });
});
