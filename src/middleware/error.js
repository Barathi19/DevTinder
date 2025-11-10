const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, _, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(error);

  if (error.code == 11000) {
    const [key, value] = Object.entries(error.keyValue)[0];
    const message = `Duplicate ${key}, ${value} already exist.`;

    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });

  next();
};

module.exports = errorHandler;
