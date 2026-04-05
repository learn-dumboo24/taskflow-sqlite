function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function daysOverdue(dueDate) {
  return daysBetween(dueDate, new Date());
}

function isOverdue(dueDate) {
  return new Date(dueDate) < new Date();
}

module.exports = { daysBetween, daysOverdue, isOverdue };
