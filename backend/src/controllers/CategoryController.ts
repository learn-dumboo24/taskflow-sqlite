import { Request, Response, NextFunction } from 'express';
import CategoryService from '../services/CategoryService';

class CategoryController {
  private readonly categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
    this.getAll = this.getAll.bind(this);
    this.create = this.create.bind(this);
    this.addToTask = this.addToTask.bind(this);
    this.removeFromTask = this.removeFromTask.bind(this);
    this.remove = this.remove.bind(this);
    this.getForTask = this.getForTask.bind(this);
  }

  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const categories = this.categoryService.getUserCategories(req.user!.id);
      res.json(categories.map(c => c.toJSON()));
    } catch (err) { next(err); }
  }

  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const category = this.categoryService.createCategory(req.user!.id, req.body);
      res.status(201).json(category.toJSON());
    } catch (err) { next(err); }
  }

  getForTask(req: Request, res: Response, next: NextFunction): void {
    try {
      const categories = this.categoryService.getTaskCategories(parseInt(req.params.taskId));
      res.json(categories.map(c => c.toJSON()));
    } catch (err) { next(err); }
  }

  addToTask(req: Request, res: Response, next: NextFunction): void {
    try {
      const { categoryId } = req.body as { categoryId: number };
      this.categoryService.addToTask(parseInt(req.params.taskId), categoryId);
      res.json({ message: 'Category added to task' });
    } catch (err) { next(err); }
  }

  removeFromTask(req: Request, res: Response, next: NextFunction): void {
    try {
      this.categoryService.removeFromTask(parseInt(req.params.taskId), parseInt(req.params.categoryId));
      res.json({ message: 'Category removed from task' });
    } catch (err) { next(err); }
  }

  remove(req: Request, res: Response, next: NextFunction): void {
    try {
      this.categoryService.deleteCategory(parseInt(req.params.id), req.user!.id);
      res.json({ message: 'Category deleted' });
    } catch (err) { next(err); }
  }
}

export default CategoryController;
