// Abstract base class — defines interface all models must follow
class BaseModel {
  #id;
  #createdAt;
  #updatedAt;

  constructor(data = {}) {
    this.#id = data.id || null;
    this.#createdAt = data.created_at || null;
    this.#updatedAt = data.updated_at || null;
  }

  // Getters — controlled read access to private state
  get id() { return this.#id; }
  get created_at() { return this.#createdAt; }
  get updated_at() { return this.#updatedAt; }

  // Abstract methods — subclasses MUST override these (polymorphism)
  // Calling them on BaseModel directly throws — enforces the contract

  validate() {
    throw new Error(`${this.constructor.name} must implement validate()`);
  }

  toJSON() {
    throw new Error(`${this.constructor.name} must implement toJSON()`);
  }

  // Each model summarizes itself differently — polymorphism in action
  getSummary() {
    throw new Error(`${this.constructor.name} must implement getSummary()`);
  }

  // toString delegates to getSummary — template method pattern
  toString() {
    return this.getSummary();
  }
}

module.exports = BaseModel;
