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

export const addStudent = createOne(User, {
  isConfirmed: true,
  role: "student",
});

export const getAllStudent = asyncHandler(async (req, res, next) => {
  const students = await User.find({
    role: "student",
    isConfirmed: true,
  }).select({ isConfirmed: 0, password: 0 });

  if (students.length < 1) return next(new ApiError(400, "No Students"));

  sendResponse(res, {
    message: "All Students",
    data: { results: students.length, students },
  });
});

export const getStudentById = getById(User);

export const updateStudent = updateOne(User);

export const deleteStudent = deleteOne(User);
