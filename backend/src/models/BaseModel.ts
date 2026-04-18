import { BaseModelData } from '../types';

// Abstract class — TypeScript enforces subclasses implement all abstract members
// at compile time, not just runtime
abstract class BaseModel {
  private readonly _id: number | null;
  private readonly _createdAt: string | null;
  private readonly _updatedAt: string | null;

  constructor(data: BaseModelData = {}) {
    this._id = data.id ?? null;
    this._createdAt = data.created_at ?? null;
    this._updatedAt = data.updated_at ?? null;
  }

  // Getters expose private state in a controlled way (Encapsulation)
  get id(): number | null { return this._id; }
  get created_at(): string | null { return this._createdAt; }
  get updated_at(): string | null { return this._updatedAt; }

  // Abstract methods — compiler error if subclass forgets to implement (Abstraction)
  abstract validate(): string[];
  abstract toJSON(): Record<string, unknown>;
  abstract getSummary(): string;

  // Template method — calls getSummary() which each subclass defines (Polymorphism)
  toString(): string {
    return this.getSummary();
  }
}

export default BaseModel;
