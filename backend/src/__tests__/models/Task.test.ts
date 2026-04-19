import Task from '../../models/Task';

describe('Task — state machine (Encapsulation)', () => {
  it('allows pending → in_progress transition', () => {
    const task = new Task({ title: 'Test', due_date: '2030-01-01', status: 'pending' });
    task.transition('in_progress');
    expect(task.status).toBe('in_progress');
  });

  it('allows in_progress → completed transition', () => {
    const task = new Task({ title: 'Test', due_date: '2030-01-01', status: 'in_progress' });
    task.transition('completed');
    expect(task.status).toBe('completed');
  });

  it('rejects completed → in_progress (invalid transition)', () => {
    const task = new Task({ title: 'Test', due_date: '2030-01-01', status: 'completed' });
    expect(() => task.transition('in_progress')).toThrow("Cannot transition from 'completed' to 'in_progress'");
  });

  it('rejects pending → completed back to pending', () => {
    const task = new Task({ status: 'completed' });
    expect(() => task.transition('pending')).toThrow();
  });

  it('isOverdue returns true for past due date with non-completed status', () => {
    const task = new Task({ due_date: '2020-01-01', status: 'pending' });
    expect(task.isOverdue).toBe(true);
  });

  it('isOverdue returns false for completed task even if past due', () => {
    const task = new Task({ due_date: '2020-01-01', status: 'completed' });
    expect(task.isOverdue).toBe(false);
  });

  it('isOverdue returns false for future due date', () => {
    const task = new Task({ due_date: '2099-01-01', status: 'pending' });
    expect(task.isOverdue).toBe(false);
  });

  it('validate() returns errors for missing title and due_date', () => {
    const task = new Task({});
    const errors = task.validate();
    expect(errors).toContain('Title is required');
    expect(errors).toContain('Due date is required');
  });

  it('validate() returns empty array for valid task', () => {
    const task = new Task({ title: 'Valid task', due_date: '2030-01-01', priority: 'medium', status: 'pending' });
    expect(task.validate()).toHaveLength(0);
  });

  it('getSummary() includes task title and status', () => {
    const task = new Task({ id: 1, title: 'Fix bug', due_date: '2030-01-01', status: 'pending' });
    const summary = task.getSummary();
    expect(summary).toContain('Task');
    expect(summary).toContain('Fix bug');
    expect(summary).toContain('pending');
  });

  it('toJSON() exposes all expected fields', () => {
    const task = new Task({ id: 5, title: 'T', due_date: '2030-01-01', user_id: 1 });
    const json = task.toJSON();
    expect(json).toHaveProperty('id', 5);
    expect(json).toHaveProperty('title', 'T');
    expect(json).toHaveProperty('user_id', 1);
  });
});
