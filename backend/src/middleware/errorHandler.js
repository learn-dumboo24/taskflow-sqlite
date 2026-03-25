function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`);

  // map known error messages to proper HTTP status codes
  let status = err.status || 500;
  if (err.message.includes('not found')) status = 404;
  if (err.message.includes('Not authorized') || err.message.includes('Insufficient')) status = 403;
  if (err.message.includes('already registered') || err.message.includes('required') || err.message.includes('Invalid')) status = 400;

  const message = err.message || 'Internal server error';

  // don't leak stack traces in production
  const response = { error: message };
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

module.exports = errorHandler;
