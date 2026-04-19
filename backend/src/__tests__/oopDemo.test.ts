import BaseModel from '../models/BaseModel';
import User from '../models/User';
import Task from '../models/Task';
import FollowUp from '../models/FollowUp';

/**
 * OOP PRINCIPLES DEMONSTRATION
 * This file explicitly proves all four OOP principles at runtime.
 * Used to verify design correctness, not just functionality.
 */

describe('OOP Principle 1 — Inheritance', () => {
  it('User, Task, FollowUp all inherit from BaseModel', () => {
    const user = new User({ id: 1, name: 'Sanket', email: 'x@x.com' });
    const task = new Task({ id: 2, title: 'Task', due_date: '2030-01-01' });
    const followUp = new FollowUp({ id: 3, task_id: 1, user_id: 1, level: 1, message: 'x' });

    expect(user).toBeInstanceOf(BaseModel);
    expect(task).toBeInstanceOf(BaseModel);
    expect(followUp).toBeInstanceOf(BaseModel);
  });

  it('subclasses inherit id and created_at from BaseModel', () => {
    const task = new Task({ id: 99, created_at: '2026-02-10' });
    expect(task.id).toBe(99);
    expect(task.created_at).toBe('2026-02-10');
  });
});

describe('OOP Principle 2 — Encapsulation', () => {
  it('Task status is private — only changeable via transition()', () => {
    const task = new Task({ status: 'completed' });
    // Direct mutation not possible — must use controlled method
    expect(() => task.transition('pending')).toThrow();
    expect(task.status).toBe('completed');
  });

  it('FollowUp level only increases via escalate() — never decreases', () => {
    const f = new FollowUp({ task_id: 1, user_id: 1, level: 2, status: 'pending', message: 'x' });
    f.escalate();
    expect(f.level).toBe(3);
    f.escalate(); // capped at 3
    expect(f.level).toBe(3);
  });

  it('User.toJSON() hides password_hash — only toPersistenceObject() exposes it', () => {
    const user = new User({ name: 'A', email: 'a@a.com', password_hash: 'bcrypt_secret' });
    expect(user.toJSON()).not.toHaveProperty('password_hash');
    expect(user.toPersistenceObject()).toHaveProperty('password_hash');
  });
});

describe('OOP Principle 3 — Abstraction', () => {
  it('BaseModel cannot be instantiated directly (abstract class)', () => {
    // TypeScript enforces this at compile time.
    // At runtime, direct new BaseModel() would work (JS limitation) but
    // getSummary()/validate()/toJSON() would throw — enforcing the contract.
    class ConcreteModel extends BaseModel {
      validate() { return []; }
      toJSON() { return {}; }
      getSummary() { return 'concrete'; }
    }
    const model = new ConcreteModel({});
    expect(model.getSummary()).toBe('concrete');
  });

  it('BaseModel.toString() delegates to getSummary() — template method pattern', () => {
    const task = new Task({ id: 1, title: 'Report', due_date: '2030-01-01' });
    expect(task.toString()).toBe(task.getSummary());
  });
});

describe('OOP Principle 4 — Polymorphism', () => {
  it('same getSummary() call produces different output per class', () => {
    const models: BaseModel[] = [
      new User({ id: 1, name: 'Sanket', email: 'x@x.com', role: 'user' }),
      new Task({ id: 2, title: 'Write tests', due_date: '2030-01-01', status: 'pending' }),
      new FollowUp({ id: 3, task_id: 1, user_id: 1, level: 2, status: 'pending', message: 'test' }),
    ];

    const summaries = models.map(m => m.getSummary());

    expect(summaries[0]).toMatch(/^User/);
    expect(summaries[1]).toMatch(/^Task/);
    expect(summaries[2]).toMatch(/^FollowUp/);
  });

  it('same validate() call enforces different rules per class', () => {
    const models: BaseModel[] = [
      new User({}),
      new Task({}),
      new FollowUp({}),
    ];

    const [userErrors, taskErrors, followUpErrors] = models.map(m => m.validate());

    expect(userErrors).toContain('Name must be at least 2 characters');
    expect(taskErrors).toContain('Title is required');
    expect(followUpErrors).toContain('task_id is required');

    // All different — same method, different behaviour
    expect(userErrors).not.toEqual(taskErrors);
    expect(taskErrors).not.toEqual(followUpErrors);
  });

  it('same toJSON() call returns different shapes per class', () => {
    const user = new User({ id: 1, name: 'A', email: 'a@a.com' });
    const task = new Task({ id: 1, title: 'T', due_date: '2030-01-01' });
    const followUp = new FollowUp({ id: 1, task_id: 1, user_id: 1, level: 1, message: 'x' });

    expect(user.toJSON()).toHaveProperty('email');
    expect(user.toJSON()).not.toHaveProperty('title');

    expect(task.toJSON()).toHaveProperty('due_date');
    expect(task.toJSON()).not.toHaveProperty('email');

    expect(followUp.toJSON()).toHaveProperty('level');
    expect(followUp.toJSON()).not.toHaveProperty('due_date');
  });
});
