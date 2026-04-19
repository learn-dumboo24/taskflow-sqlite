import User from '../../models/User';

describe('User — encapsulation and validation', () => {
  it('validate() passes for valid name and email', () => {
    const user = new User({ name: 'Sanket Jha', email: 'sanket@test.com' });
    expect(user.validate()).toHaveLength(0);
  });

  it('validate() fails for short name', () => {
    const user = new User({ name: 'S', email: 'sanket@test.com' });
    expect(user.validate()).toContain('Name must be at least 2 characters');
  });

  it('validate() fails for invalid email', () => {
    const user = new User({ name: 'Sanket', email: 'not-an-email' });
    expect(user.validate()).toContain('Invalid email');
  });

  it('toJSON() does not expose password_hash', () => {
    const user = new User({ name: 'Sanket', email: 'x@x.com', password_hash: 'secret' });
    const json = user.toJSON();
    expect(json).not.toHaveProperty('password_hash');
  });

  it('toPersistenceObject() exposes password_hash', () => {
    const user = new User({ name: 'Sanket', email: 'x@x.com', password_hash: 'hashed' });
    expect(user.toPersistenceObject()).toHaveProperty('password_hash', 'hashed');
  });

  it('isAdmin() returns true only for admin role', () => {
    const admin = new User({ role: 'admin' });
    const regular = new User({ role: 'user' });
    expect(admin.isAdmin()).toBe(true);
    expect(regular.isAdmin()).toBe(false);
  });

  it('getSummary() contains User, name, and role', () => {
    const user = new User({ id: 1, name: 'Sanket', email: 'x@x.com', role: 'user' });
    expect(user.getSummary()).toContain('User');
    expect(user.getSummary()).toContain('Sanket');
  });
});
