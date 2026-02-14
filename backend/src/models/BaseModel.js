class BaseModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.created_at = data.created_at || null;
    this.updated_at = data.updated_at || null;
  }

  toJSON() {
    const json = {};
    for (const key of Object.keys(this)) {
      json[key] = this[key];
    }
    return json;
  }

  validate() {
    throw new Error('validate() must be implemented by subclass');
  }
}

module.exports = BaseModel;
