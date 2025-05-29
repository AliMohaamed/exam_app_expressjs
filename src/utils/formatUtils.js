// utils/formatUtils.js
export const formatQuestions = (questions) =>
  questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    questionType: q.questionType,
    points: q.points,
    difficulty: q.difficulty,
    ...(q.questionType === "multiple-choice"
      ? { options: q.options.map((opt) => ({ _id: opt._id, text: opt.text })) }
      : {}),
  }));
