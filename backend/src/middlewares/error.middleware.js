/**
 * Global error handler middleware.
 * Must be registered LAST in app.js (after all routes).
 */
const errorHandler = (err, req, res, _next) => {
  console.error("💥 Error:", err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
