const notFound = (request, response, next) => {
  const error = new Error(`Route not found: ${request.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, request, response, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message;
  const isProduction = process.env.NODE_ENV === 'production';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(', ');
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists';
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired authentication token';
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    success: false,
    message: isProduction && statusCode >= 500 ? 'Something went wrong on the server' : message,
  });
};

export { errorHandler, notFound };
