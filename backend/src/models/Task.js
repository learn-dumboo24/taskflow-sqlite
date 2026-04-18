const BaseModel = require('./BaseModel');

// Valid status transitions — state machine, not arbitrary changes
const VALID_TRANSITIONS = {
  pending:     ['in_progress', 'completed'],
  in_progress: ['pending', 'completed'],
  completed:   [],
};

const VALID_PRIORITIES = ['low', 'medium', 'high'];

class Task extends BaseModel {
  // Private fields (Encapsulation)
  #userId;
  #title;
  #description;
  #status;
  #priority;
  #dueDate;

  constructor(data = {}) {
    super(data);
    this.#userId = data.user_id || null;
    this.#title = data.title || '';
    this.#description = data.description || '';
    this.#status = data.status || 'pending';
    this.#priority = data.priority || 'medium';
    this.#dueDate = data.due_date || null;
  }

  // Getters
  get user_id() { return this.#userId; }
  get title() { return this.#title; }
  get description() { return this.#description; }
  get status() { return this.#status; }
  get priority() { return this.#priority; }
  get due_date() { return this.#dueDate; }

  // Computed property — derived from private state, no setter needed
  get isOverdue() {
    return this.#dueDate && new Date(this.#dueDate) < new Date() && this.#status !== 'completed';
  }

  // Setter with validation
  set priority(v) {
    if (!VALID_PRIORITIES.includes(v)) throw new Error(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    this.#priority = v;
  }

  // State machine — controlled status changes only (Encapsulation)
  // Prevents invalid transitions like completed → in_progress
  transition(newStatus) {
    const allowed = VALID_TRANSITIONS[this.#status];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Cannot transition from '${this.#status}' to '${newStatus}'`);
    }
    this.#status = newStatus;
  }

  // Polymorphism — Task's own validate()
  validate() {
    const errors = [];
    if (!this.#title || this.#title.trim().length === 0) errors.push('Title is required');
    if (!this.#dueDate) errors.push('Due date is required');
    if (this.#dueDate && isNaN(Date.parse(this.#dueDate))) errors.push('Invalid due date');
    if (!VALID_PRIORITIES.includes(this.#priority)) errors.push('Invalid priority');
    return errors;
  }

  // Polymorphism — Task's own toJSON()
  toJSON() {
    return {
      id: this.id,
      user_id: this.#userId,
      title: this.#title,
      description: this.#description,
      status: this.#status,
      priority: this.#priority,
      due_date: this.#dueDate,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  // Polymorphism — Task's own getSummary()
  getSummary() {
    const overdueFlag = this.isOverdue ? ' ⚠️ OVERDUE' : '';
    return `Task[${this.id}]: "${this.#title}" [${this.#status}/${this.#priority}] due: ${this.#dueDate}${overdueFlag}`;
  }
}

module.exports = Task;
