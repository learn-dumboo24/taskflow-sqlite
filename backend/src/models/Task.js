const BaseModel = require('./BaseModel');

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

class Task extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.user_id = data.user_id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.due_date = data.due_date || null;
  }

  isOverdue() {
    if (!this.due_date) return false;
    return new Date(this.due_date) < new Date() && this.status !== 'completed';
  }

  markComplete() {
    this.status = 'completed';
  }

  validate() {
    const errors = [];
    if (!this.title || this.title.trim().length < 1) errors.push('Title is required');
    if (!this.due_date) errors.push('Due date is required');
    if (this.due_date && isNaN(Date.parse(this.due_date))) errors.push('Invalid due date format');
    if (!VALID_STATUSES.includes(this.status)) errors.push('Invalid status');
    if (!VALID_PRIORITIES.includes(this.priority)) errors.push('Invalid priority');
    return errors;
  }
}

module.exports = Task;
