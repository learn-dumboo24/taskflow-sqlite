const BaseModel = require('./BaseModel');

const LEVEL_LABELS = { 1: 'Reminder', 2: 'Urgent', 3: 'Critical' };

class FollowUp extends BaseModel {
  // Private fields (Encapsulation)
  #taskId;
  #userId;
  #level;
  #status;
  #message;
  #resolvedAt;

  constructor(data = {}) {
    super(data);
    this.#taskId = data.task_id || null;
    this.#userId = data.user_id || null;
    this.#level = data.level || 1;
    this.#status = data.status || 'pending';
    this.#message = data.message || '';
    this.#resolvedAt = data.resolved_at || null;
  }

  // Getters
  get task_id() { return this.#taskId; }
  get user_id() { return this.#userId; }
  get level() { return this.#level; }
  get status() { return this.#status; }
  get message() { return this.#message; }
  get resolved_at() { return this.#resolvedAt; }

  // Computed property
  get isResolved() { return this.#status === 'resolved'; }

  // Controlled state change — can only go up, never down (Encapsulation)
  escalate() {
    if (this.#status === 'resolved') throw new Error('Cannot escalate a resolved followup');
    if (this.#level >= 3) return; // already at max level
    this.#level += 1;
  }

  // Controlled resolve — sets timestamp automatically
  resolve() {
    if (this.isResolved) throw new Error('FollowUp is already resolved');
    this.#status = 'resolved';
    this.#resolvedAt = new Date().toISOString();
  }

  // Polymorphism — FollowUp's own validate()
  validate() {
    const errors = [];
    if (!this.#taskId) errors.push('task_id is required');
    if (!this.#userId) errors.push('user_id is required');
    if (![1, 2, 3].includes(this.#level)) errors.push('level must be 1, 2, or 3');
    if (!this.#message) errors.push('message is required');
    return errors;
  }

  // Polymorphism — FollowUp's own toJSON()
  toJSON() {
    return {
      id: this.id,
      task_id: this.#taskId,
      user_id: this.#userId,
      level: this.#level,
      status: this.#status,
      message: this.#message,
      resolved_at: this.#resolvedAt,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Polymorphism — FollowUp's own getSummary()
  getSummary() {
    const label = LEVEL_LABELS[this.#level] || 'Unknown';
    return `FollowUp[${this.id}]: Level ${this.#level} (${label}) for task #${this.#taskId} — ${this.#status}`;
  }
}

module.exports = FollowUp;
