import FollowUp from '../../models/FollowUp';

describe('FollowUp — controlled state (Encapsulation)', () => {
  function makeFollowUp(overrides = {}) {
    return new FollowUp({ task_id: 1, user_id: 1, level: 1, status: 'pending', message: 'test', ...overrides });
  }

  it('escalate() increases level from 1 to 2', () => {
    const f = makeFollowUp({ level: 1 });
    f.escalate();
    expect(f.level).toBe(2);
  });

  it('escalate() increases level from 2 to 3', () => {
    const f = makeFollowUp({ level: 2 });
    f.escalate();
    expect(f.level).toBe(3);
  });

  it('escalate() does not go beyond level 3', () => {
    const f = makeFollowUp({ level: 3 });
    f.escalate();
    expect(f.level).toBe(3);
  });

  it('escalate() throws if already resolved', () => {
    const f = makeFollowUp({ status: 'resolved' });
    expect(() => f.escalate()).toThrow('Cannot escalate a resolved followup');
  });

  it('resolve() sets status to resolved', () => {
    const f = makeFollowUp();
    f.resolve();
    expect(f.status).toBe('resolved');
  });

  it('resolve() sets resolved_at timestamp', () => {
    const f = makeFollowUp();
    f.resolve();
    expect(f.resolved_at).not.toBeNull();
    expect(new Date(f.resolved_at!).getTime()).toBeGreaterThan(0);
  });

  it('resolve() throws if already resolved', () => {
    const f = makeFollowUp({ status: 'resolved' });
    expect(() => f.resolve()).toThrow('FollowUp is already resolved');
  });

  it('isResolved returns true after resolve()', () => {
    const f = makeFollowUp();
    expect(f.isResolved).toBe(false);
    f.resolve();
    expect(f.isResolved).toBe(true);
  });

  it('validate() errors on missing task_id', () => {
    const f = new FollowUp({ user_id: 1, level: 1, message: 'x' });
    expect(f.validate()).toContain('task_id is required');
  });

  it('getSummary() includes level and task_id', () => {
    const f = makeFollowUp({ id: 7, level: 2 });
    const s = f.getSummary();
    expect(s).toContain('FollowUp');
    expect(s).toContain('Level 2');
  });
});
