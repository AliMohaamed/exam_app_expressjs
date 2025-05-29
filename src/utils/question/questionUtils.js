export function isQuestionTypeChanged(oldType, newType) {
  return newType && newType !== oldType;
}

export function statsQuestion(questions) {
  const stats = {
    totalQuestions: questions.length,
    questionsByType: {},
    questionsByDifficulty: {},
    totalPoints: 0,
  };

  questions.forEach((question) => {
    // Count by type
    stats.questionsByType[question.questionType] =
      (stats.questionsByType[question.questionType] || 0) + 1;

    // Count by difficulty
    stats.questionsByDifficulty[question.difficulty] =
      (stats.questionsByDifficulty[question.difficulty] || 0) + 1;

    // Sum total points
    stats.totalPoints += question.points;
  });
  return stats;
}
