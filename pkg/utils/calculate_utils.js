export function normalizeModal(amount, modalLevel, targetLevel, date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const daysInYear = getDaysInYear(year);

  if (modalLevel === targetLevel) return amount;

  if (modalLevel === "day" && targetLevel === "month") return amount * daysInMonth;
  if (modalLevel === "day" && targetLevel === "week") return amount * 7;

  if (modalLevel === "week" && targetLevel === "day") return amount / 7;
  if (modalLevel === "week" && targetLevel === "month") return (amount / 7) * daysInMonth;

  if (modalLevel === "month" && targetLevel === "day") return amount / daysInMonth;
  if (modalLevel === "month" && targetLevel === "week") return (amount / daysInMonth) * 7;

  if (modalLevel === "year" && targetLevel === "month") return (amount / daysInYear) * daysInMonth;
  if (modalLevel === "year" && targetLevel === "day") return amount / daysInYear;
  if (modalLevel === "year" && targetLevel === "week") return (amount / daysInYear) * 7;

  throw new Error(`Conversion from level "${modalLevel}" to "${targetLevel}" is not supported`);
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getDaysInYear(year) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const diff = end.getTime() - start.getTime();
  return diff / (1000 * 60 * 60 * 24);
}
