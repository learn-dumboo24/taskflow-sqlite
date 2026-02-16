const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  findByEmail(email) {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  findAllActive() {
    return this.db.prepare("SELECT * FROM users WHERE is_active = 1").all();
  }
}

module.exports = UserRepository;
