import Task from '../models/Task';
import { TaskData } from '../types';

export interface ITaskService {
  createTask(userId: number, data: Partial<TaskData>): Task;
  getUserTasks(userId: number): Task[];
  getAllTasks(): unknown[];
  updateTask(id: number, userId: number, data: Partial<TaskData>, isAdmin?: boolean): Task;
  deleteTask(id: number, userId: number, isAdmin?: boolean): boolean;
  getOverdueTasks(): Task[];
}
