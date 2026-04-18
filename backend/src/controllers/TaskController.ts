import { Request, Response, NextFunction } from 'express';
import TaskService from '../services/TaskService';

class TaskController {
  private readonly taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const task = this.taskService.createTask(req.user!.id, req.body);
      res.status(201).json(task.toJSON());
    } catch (err) {
      next(err);
    }
  }

  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const isAdmin = req.user!.role === 'admin';
      const tasks = isAdmin
        ? this.taskService.getAllTasks()
        : this.taskService.getUserTasks(req.user!.id).map(t => t.toJSON());
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const isAdmin = req.user!.role === 'admin';
      const task = this.taskService.updateTask(parseInt(req.params.id), req.user!.id, req.body, isAdmin);
      res.json(task.toJSON());
    } catch (err) {
      next(err);
    }
  }

  remove(req: Request, res: Response, next: NextFunction): void {
    try {
      const isAdmin = req.user!.role === 'admin';
      this.taskService.deleteTask(parseInt(req.params.id), req.user!.id, isAdmin);
      res.json({ message: 'Task deleted' });
    } catch (err) {
      next(err);
    }
  }
}

export default TaskController;
