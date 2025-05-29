import {
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addWeeks,
  addMonths,
  addYears,
} from "date-fns";

/**
 * Generate a precise expiry date using date-fns.
 * @param {number} amount - The amount of time to add (must be > 0).
 * @param {'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'} unit - The unit of time.
 * @returns {Date} The calculated expiry date.
 * @throws Will throw an error if unit is invalid or amount is not positive.
 */
export function generateExpiryDate(amount, unit) {
  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  const now = new Date();

  switch (unit) {
    case "seconds":
      return addSeconds(now, amount);
    case "minutes":
      return addMinutes(now, amount);
    case "hours":
      return addHours(now, amount);
    case "days":
      return addDays(now, amount);
    case "weeks":
      return addWeeks(now, amount);
    case "months":
      return addMonths(now, amount);
    case "years":
      return addYears(now, amount);
    default:
      throw new Error(`Invalid time unit provided: ${unit}`);
  }
}

export const isExamExpired = (attempt) => {
  const now = Date.now();
  const endTime =
    attempt.endTime ||
    new Date(attempt.startTime.getTime() + attempt.exam.duration * 60 * 1000);
  return now > endTime;
};
