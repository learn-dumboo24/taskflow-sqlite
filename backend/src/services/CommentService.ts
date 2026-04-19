import Comment from '../models/Comment';
import CommentRepository from '../repositories/CommentRepository';
import TaskRepository from '../repositories/TaskRepository';
import { CommentData } from '../types';

class CommentService {
  private readonly commentRepo: CommentRepository;
  private readonly taskRepo: TaskRepository;

  constructor() {
    this.commentRepo = new CommentRepository();
    this.taskRepo = new TaskRepository();
  }

  addComment(taskId: number, userId: number, content: string): Comment {
    const task = this.taskRepo.findById(taskId);
    if (!task) throw new Error('Task not found');

    const comment = new Comment({ task_id: taskId, user_id: userId, content });
    const errors = comment.validate();
    if (errors.length > 0) throw new Error(errors.join(', '));

    const { id, created_at, updated_at, ...fields } = comment.toJSON();
    const row = this.commentRepo.create(fields as Partial<CommentData>);
    return new Comment(row);
  }

  getTaskComments(taskId: number): Comment[] {
    return this.commentRepo.findByTaskId(taskId).map(r => new Comment(r));
  }

  deleteComment(id: number, userId: number, isAdmin = false): boolean {
    const row = this.commentRepo.findById(id);
    if (!row) throw new Error('Comment not found');
    if (!isAdmin && row.user_id !== userId) throw new Error('Not authorized');
    return this.commentRepo.delete(id);
  }
}

export default CommentService;
