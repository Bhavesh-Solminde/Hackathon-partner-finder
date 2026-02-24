/**
 * Wraps an async Express route handler to catch errors
 * and forward them to the global error middleware.
 *
 * @param {Function} fn - Async controller function (req, res, next) => Promise
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
