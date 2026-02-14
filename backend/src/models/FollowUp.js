const BaseModel = require('./BaseModel');

class FollowUp extends BaseModel {
  constructor(data = {}) {
    super(data);
    this.task_id = data.task_id || null;
    this.user_id = data.user_id || null;
    this.level = data.level || 1;
    this.status = data.status || 'pending';
    this.message = data.message || '';
    this.resolved_at = data.resolved_at || null;
  }

  isResolved() {
    return this.status === 'resolved';
  }

  resolve() {
    this.status = 'resolved';
    this.resolved_at = new Date().toISOString();
  }

  escalate() {
    if (this.level < 3) {
      this.level += 1;
    }
  }

  validate() {
    const errors = [];
    if (!this.task_id) errors.push('task_id is required');
    if (!this.user_id) errors.push('user_id is required');
    if (![1, 2, 3].includes(this.level)) errors.push('level must be 1, 2, or 3');
    return errors;
  }
}

module.exports = FollowUp;
