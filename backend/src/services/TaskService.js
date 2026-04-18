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

    // toJSON() exposes only what's needed — encapsulation respected
    const { id, created_at, updated_at, ...fields } = task.toJSON();
    const row = this.taskRepo.create(fields);
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

    const existing = new Task(row);

    // Use model's transition() for status changes — enforces state machine
    if (data.status && data.status !== existing.status) {
      existing.transition(data.status);
    }

    const allowed = ['title', 'description', 'priority', 'due_date'];
    const updates = { status: existing.status };
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
