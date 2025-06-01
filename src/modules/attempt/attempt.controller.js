import { ExamAttempt } from "../../../DB/models/attempt.model.js";
import { Exam } from "../../../DB/models/exam.model.js";
import { AttemptService } from "../../services/attempt.service.js";
import { ExamService } from "../../services/exam.service.js";
import APIFeatures from "../../utils/apiFeatures.js";
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
export const getAllAttempts = asyncHandler(async (req, res) => {
const results = await AttemptService.getAllAttempts(req.query);
  res.json({ results });
});

// export const getAllAttempts = asyncHandler(async (req, res) => {
//   const { subject, student, status, isPassed, fromDate, toDate } = req.query;

//   let matchConditions = {};

//   if (status) matchConditions.status = status;
//   if (isPassed !== undefined)
//     matchConditions.percentage = {
//       $gte: isPassed === "true" ? 60 : 0,
//       $lt: isPassed === "true" ? 100 : 60,
//     };

//   if (fromDate || toDate) {
//     matchConditions.createdAt = {};
//     if (fromDate) matchConditions.createdAt.$gte = new Date(fromDate);
//     if (toDate) matchConditions.createdAt.$lte = new Date(toDate);
//   }

//   const pipeline = [
//     {
//       $lookup: {
//         from: "exams",
//         localField: "exam",
//         foreignField: "_id",
//         as: "exam",
//       },
//     },
//     { $unwind: "$exam" },
//     {
//       $lookup: {
//         from: "users", // Assuming "users" is the collection for students
//         localField: "student", // foreign key in ExamAttempt
//         foreignField: "_id", // primary key in User
//         as: "student", // alias for the joined data
//       },
//     },
//     { $unwind: "$student" },

//     { $match: matchConditions },
//   ];

//   if (subject) {
//     pipeline.push({
//       $match: {
//         "exam.subject": { $regex: subject, $options: "i" },
//       },
//     });
//   }

//   if (student) {
//     pipeline.push({
//       $match: {
//         "student.name": { $regex: student, $options: "i" },
//       },
//     });
//   }

//   pipeline.push({ $sort: { createdAt: -1 } });

//   // Apply APIFeatures
//   const apiFeatures = new APIFeatures(
//     ExamAttempt.aggregate(pipeline),
//     req.query
//   ).paginate();

//   const results = await apiFeatures.query;

//   sendResponse(res, {
//     message: "Filtered Exam Attempts Retrieved Successfully",
//     data: {
//       totalAttempts: results.length,
//       attempts: results,
//     },
//   });
// });
