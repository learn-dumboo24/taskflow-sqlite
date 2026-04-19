import { Request, Response, NextFunction } from 'express';
import CommentService from '../services/CommentService';

class CommentController {
  private readonly commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
    this.getForTask = this.getForTask.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }

  getForTask(req: Request, res: Response, next: NextFunction): void {
    try {
      const comments = this.commentService.getTaskComments(parseInt(req.params.taskId));
      res.json(comments.map(c => c.toJSON()));
    } catch (err) { next(err); }
  }

  add(req: Request, res: Response, next: NextFunction): void {
    try {
      const { content } = req.body as { content?: string };
      if (!content) { res.status(400).json({ error: 'content is required' }); return; }
      const comment = this.commentService.addComment(parseInt(req.params.taskId), req.user!.id, content);
      res.status(201).json(comment.toJSON());
    } catch (err) { next(err); }
  }

  remove(req: Request, res: Response, next: NextFunction): void {
    try {
      const isAdmin = req.user!.role === 'admin';
      this.commentService.deleteComment(parseInt(req.params.id), req.user!.id, isAdmin);
      res.json({ message: 'Comment deleted' });
    } catch (err) { next(err); }
  }
}

export default CommentController;
