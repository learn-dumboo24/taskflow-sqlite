import Category from '../models/Category';
import CategoryRepository from '../repositories/CategoryRepository';
import { CategoryData } from '../types';

class CategoryService {
  private readonly categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  createCategory(userId: number, data: Partial<CategoryData>): Category {
    const category = new Category({ ...data, user_id: userId });
    const errors = category.validate();
    if (errors.length > 0) throw new Error(errors.join(', '));

    const { id, created_at, updated_at, ...fields } = category.toJSON();
    const row = this.categoryRepo.create(fields as Partial<CategoryData>);
    return new Category(row);
  }

  getUserCategories(userId: number): Category[] {
    return this.categoryRepo.findByUserId(userId).map(r => new Category(r));
  }

  getTaskCategories(taskId: number): Category[] {
    return this.categoryRepo.findByTaskId(taskId).map(r => new Category(r));
  }

  addToTask(taskId: number, categoryId: number): void {
    this.categoryRepo.addToTask(taskId, categoryId);
  }

  removeFromTask(taskId: number, categoryId: number): void {
    this.categoryRepo.removeFromTask(taskId, categoryId);
  }

  deleteCategory(id: number, userId: number): boolean {
    const row = this.categoryRepo.findById(id);
    if (!row) throw new Error('Category not found');
    if (row.user_id !== userId) throw new Error('Not authorized');
    return this.categoryRepo.delete(id);
  }
}

export default CategoryService;
