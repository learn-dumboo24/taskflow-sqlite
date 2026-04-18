import Task from '../models/Task';
import TaskRepository from '../repositories/TaskRepository';
import { ITaskService } from '../interfaces/ITaskService';
import { TaskData, TaskStatus } from '../types';

class TaskService implements ITaskService {
  private readonly taskRepo: TaskRepository;

  constructor() {
    this.taskRepo = new TaskRepository();
  }

  createTask(userId: number, data: Partial<TaskData>): Task {
    const task = new Task({ ...data, user_id: userId });
    const errors = task.validate();
    if (errors.length > 0) throw new Error(errors.join(', '));

    if (new Date(task.due_date!).getTime() < Date.now()) {
      throw new Error('Due date cannot be in the past');
    }

    const { id, created_at, updated_at, ...fields } = task.toJSON();
    const row = this.taskRepo.create(fields as Partial<TaskData>);
    return new Task(row);
  }

  getUserTasks(userId: number): Task[] {
    return this.taskRepo.findByUserId(userId).map(r => new Task(r));
  }

  getAllTasks(): unknown[] {
    return this.taskRepo.findAllWithUser();
  }

  updateTask(id: number, userId: number, data: Partial<TaskData>, isAdmin = false): Task {
    const row = isAdmin
      ? this.taskRepo.findById(id)
      : this.taskRepo.findByIdAndUser(id, userId);

    if (!row) throw new Error('Task not found');

    const existing = new Task(row);

    // Route status changes through the state machine — no raw assignment
    if (data.status && data.status !== existing.status) {
      existing.transition(data.status as TaskStatus);
    }

    const allowed: Array<keyof TaskData> = ['title', 'description', 'priority', 'due_date'];
    const updates: Partial<TaskData> = { status: existing.status };
    for (const key of allowed) {
      if (data[key] !== undefined) (updates as Record<string, unknown>)[key] = data[key];
    }

    const updated = this.taskRepo.update(id, updates);
    return new Task(updated);
  }

  deleteTask(id: number, userId: number, isAdmin = false): boolean {
    const row = isAdmin
      ? this.taskRepo.findById(id)
      : this.taskRepo.findByIdAndUser(id, userId);

    if (!row) throw new Error('Task not found');
    return this.taskRepo.delete(id);
  }

  getOverdueTasks(): Task[] {
    return this.taskRepo.findOverdue().map(r => new Task(r));
  }
}

export default TaskService;
