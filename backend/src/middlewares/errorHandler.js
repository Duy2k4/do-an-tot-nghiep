const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.type === 'validation') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors,
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
