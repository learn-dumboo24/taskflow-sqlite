export function daysBetween(date1: string | Date, date2: string | Date): number {
  return Math.floor((new Date(date2).getTime() - new Date(date1).getTime()) / (1000 * 60 * 60 * 24));
}

export function daysOverdue(dueDate: string | Date): number {
  return daysBetween(dueDate, new Date());
}

export function isOverdue(dueDate: string | Date): boolean {
  return new Date(dueDate) < new Date();
}
