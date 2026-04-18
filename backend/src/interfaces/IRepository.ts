// Generic repository contract — any entity can be stored/retrieved
export interface IRepository<T> {
  findById(id: number): T | undefined;
  findAll(): T[];
  create(data: Partial<T>): T;
  update(id: number, data: Partial<T>): T;
  delete(id: number): boolean;
}
