import { ExamAttempt } from "../../DB/models/attempt.model.js";
import { User } from "../../DB/models/user.model.js";

export const StudentService = {
  async singleStudent(studentId) {
    const student = await User.findById(studentId)
      .select("-isConfirmed -password")
      .lean();

    if (!student) {
      throw new ApiError(400, "No Data");
    }

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
      .populate({
        path: "answers.question",
        select: "questionText points questionType -_id",
      })
      .lean();

    return {
      ...student,
      attempts,
    };
  },
};
