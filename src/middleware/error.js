const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, _, res, next) => {
  console.log(err.stack);

  let error = { ...err };

  error.message = err.message;

  if (error.code == 11000) {
    const [key, value] = Object.entries(error.keyValue)[0];
    const message = `Duplicate ${key}, ${value} already exist.`;

    error = new ErrorResponse(message, 409);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });

  next();
};

module.exports = errorHandler;
