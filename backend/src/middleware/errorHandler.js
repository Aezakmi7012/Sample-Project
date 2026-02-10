const { AppError } = require('../errors/AppError');

/**
 * Global Error Handler Middleware
 * Follows Single Responsibility - handles ONLY error responses
 * Implements Open/Closed Principle - extensible for new error types
 */
const errorHandler = (err, req, res, next) => {
  // Handle operational errors (AppError and its subclasses)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Unique constraint violation'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found'
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  // Handle unexpected errors
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
