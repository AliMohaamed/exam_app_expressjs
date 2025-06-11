import ExcelJS from "exceljs";

export const generateAttemptsExcel = async (attempts = []) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Exam Attempts");

  // Define columns
  worksheet.columns = [
    { header: "Student Name", key: "studentName", width: 30 },
    { header: "Student Email", key: "studentEmail", width: 30 },
    { header: "Student Level", key: "studentLevel", width: 20 },
    { header: "Student Status", key: "studentStatus", width: 15 },
    { header: "Subject", key: "subject", width: 20 },
    { header: "Exam Description", key: "examDescription", width: 35 },
    { header: "Exam Level", key: "examLevel", width: 15 },
    { header: "Duration (min)", key: "duration", width: 15 },
    { header: "Start Time", key: "startTime", width: 25 },
    { header: "End Time", key: "endTime", width: 25 },
    { header: "Time Spent (sec)", key: "timeSpent", width: 15 },
    { header: "Total Score", key: "totalScore", width: 15 },
    { header: "Percentage", key: "percentage", width: 15 },
    { header: "Status", key: "status", width: 15 },
    { header: "Submission Status", key: "submissionStatus", width: 15 },
    { header: "Questions Attempted", key: "questionsAttempted", width: 20 },
    { header: "Date", key: "createdAt", width: 25 },
  ];
  console.log(attempts);
  // Add rows with styling
  attempts.forEach((attempt, index) => {
    const isPassed = attempt.percentage >= 60;
    const row = worksheet.addRow({
      studentName: attempt.student?.name,
      studentEmail: attempt.student?.email,
      studentLevel: attempt.student?.level,
      studentStatus: attempt.student?.status,
      subject: attempt.exam?.subject,
      examDescription: attempt.exam?.description,
      examLevel: attempt.exam?.level,
      duration: attempt.exam?.duration,
      startTime: new Date(attempt.startTime).toLocaleString("en-US"),
      endTime: new Date(attempt.endTime).toLocaleString("en-US"),
      timeSpent: attempt.timeSpent,
      totalScore: attempt.totalScore,
      percentage: `${attempt.percentage}%`,
      status: isPassed ? "Success" : "Fail",
      submissionStatus: attempt.status,
      questionsAttempted: attempt.answers ? attempt.answers.length : 0,
      createdAt: new Date(attempt.createdAt).toLocaleString("en-US"),
    });
    // Style: Only color the status column (column 14) based on pass/fail
    row.eachCell((cell, colNumber) => {
      // Default styling for all cells
      cell.font = {
        color: { argb: "FF000000" }, // default black
        bold: false,
      };

      // Only apply special styling to status column (column 14)
      if (colNumber === 14) {
        cell.font = {
          color: { argb: isPassed ? "FF006100" : "FF9C0006" }, // green or red
          bold: true,
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: isPassed ? "FFC6EFCE" : "FFFFC7CE" }, // light green or light red
        };
      }
    });
  });

  // Add header styling
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
  });

  return workbook;
};
