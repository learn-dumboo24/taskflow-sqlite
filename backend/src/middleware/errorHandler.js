function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // don't leak stack traces in production
  const response = { error: message };
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

module.exports = errorHandler;
