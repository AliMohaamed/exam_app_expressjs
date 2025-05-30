import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/handlers/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import {
  createOne,
  deleteOne,
  getById,
  updateOne,
} from "../../utils/handlers/handlersFactory.js";
import sendResponse from "../../utils/response.js";
import { ExamAttempt } from "../../../DB/models/attempt.model.js";

export const addStudent = createOne(User, {
  isConfirmed: true,
  role: "student",
});

export const getAllStudent = asyncHandler(async (req, res, next) => {
  // 1 All Students that are confirmed
  const students = await User.find({
    role: "student",
    isConfirmed: true,
  })
    .select("-isConfirmed -password -activationCode -otp -otpExpires")
    .lean(); // Faster query with lean()

  if (!students.length) {
    return next(new ApiError(400, "No Students"));
  }

  // 2️ All Exam Attempts that are submitted
  const attempts = await ExamAttempt.find({
    status: "submitted",
  })
    .select("-__v")
    .populate({
      path: "exam",
      select: "-createdAt -updatedAt -__v",
      populate: {
        path: "createdBy",
        select: "name -_id",
      },
    })
    .lean();

  // 3️ Group Attempts by Student
  const attemptsMap = new Map();

  for (const attempt of attempts) {
    const studentId = attempt.student.toString();
    if (!attemptsMap.has(studentId)) {
      attemptsMap.set(studentId, []);
    }
    attemptsMap.get(studentId).push(attempt);
  }

  // 4️ Link Each Student with Their Attempts
  const data = students.map((student) => {
    return {
      ...student,
      attempts: attemptsMap.get(student._id.toString()) || [],
    };
  });

  // 5️ Send response
  sendResponse(res, {
    message: "All Students",
    data: { results: data.length, students: data },
  });
});

export const getStudentById = asyncHandler(async (req, res, next) => {
  const student = await User.findById(req.params.id)
    .select("-isConfirmed -password")
    .lean();
  if (!student) return next(new ApiError(400, `No Data`));

  const attempts = await ExamAttempt.find({
    student: student._id,
  })
    .select("-__v")
    .populate({
      path: "exam",
      select: "-createdAt -updatedAt -__v",
      populate: {
        path: "createdBy",
        select: "name -_id",
      },
    })
    .lean();

  sendResponse(res, {
    data: {
      ...student,
      attempts,
    },
  });
});

export const updateStudent = updateOne(User);

export const deleteStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const student = await User.findByIdAndDelete(id);
  if (!student)
    return next(new ApiError(400, `No student with this id: ${id}`));

  await ExamAttempt.deleteMany({
    student: student._id,
  });

  sendResponse(res, { message: "Deleted Student Successfully With Attempts" });
});
