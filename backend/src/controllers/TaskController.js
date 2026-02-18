const TaskService = require('../services/TaskService');

class TaskController {
  constructor() {
    this.taskService = new TaskService();
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  create(req, res, next) {
    try {
      const task = this.taskService.createTask(req.user.id, req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }

  getAll(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';
      const tasks = isAdmin
        ? this.taskService.getAllTasks()
        : this.taskService.getUserTasks(req.user.id);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  update(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';
      const task = this.taskService.updateTask(
        parseInt(req.params.id),
        req.user.id,
        req.body,
        isAdmin
      );
      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  remove(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';
      this.taskService.deleteTask(parseInt(req.params.id), req.user.id, isAdmin);
      res.json({ message: 'Task deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TaskController;
