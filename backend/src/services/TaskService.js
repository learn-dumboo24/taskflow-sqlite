const Task = require('../models/Task');
const TaskRepository = require('../repositories/TaskRepository');

class TaskService {
  constructor() {
    this.taskRepo = new TaskRepository();
  }

  createTask(userId, data) {
    const task = new Task({ ...data, user_id: userId });
    const errors = task.validate();
    if (errors.length > 0) throw new Error(errors.join(', '));

    if (new Date(task.due_date) < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    const row = this.taskRepo.create({
      user_id: task.user_id,
      title: task.title.trim(),
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
    });

    return new Task(row);
  }

  getUserTasks(userId) {
    return this.taskRepo.findByUserId(userId).map(r => new Task(r));
  }

  getAllTasks() {
    return this.taskRepo.findAllWithUser();
  }

  updateTask(id, userId, data, isAdmin = false) {
    const row = isAdmin
      ? this.taskRepo.findById(id)
      : this.taskRepo.findByIdAndUser(id, userId);

    if (!row) throw new Error('Task not found');

    const allowed = ['title', 'description', 'status', 'priority', 'due_date'];
    const updates = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updates[key] = data[key];
    }

    if (Object.keys(updates).length === 0) throw new Error('No valid fields to update');

    const updated = this.taskRepo.update(id, updates);
    return new Task(updated);
  }

  deleteTask(id, userId, isAdmin = false) {
    const row = isAdmin
      ? this.taskRepo.findById(id)
      : this.taskRepo.findByIdAndUser(id, userId);

    if (!row) throw new Error('Task not found');
    return this.taskRepo.delete(id);
  }

  getOverdueTasks() {
    return this.taskRepo.findOverdue().map(r => new Task(r));
  }
}

module.exports = TaskService;
