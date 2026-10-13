export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);

  error.status = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.status || err.statusCode || 500;

  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  }

  const message =
    statusCode >= 500
      ? "Internal server error"
      : err.message || "Request failed";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
