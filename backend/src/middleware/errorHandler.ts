import { Request, Response, NextFunction } from 'express';

function errorHandler(err: Error & { status?: number }, req: Request, res: Response, _next: NextFunction): void {
  console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`);

  let status = err.status ?? 500;
  if (err.message.includes('not found')) status = 404;
  if (err.message.includes('Not authorized') || err.message.includes('Insufficient')) status = 403;
  if (err.message.includes('already registered') || err.message.includes('required') || err.message.includes('Invalid')) status = 400;

  const response: Record<string, unknown> = { error: err.message || 'Internal server error' };
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

export default errorHandler;
