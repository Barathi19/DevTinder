const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");

const authUser = async (req, _, next) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      next(new ErrorResponse("Unauthorized, please login!", 401));
    }

    const { token } = req.cookies;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded._id);

    if (!user) {
      next(new ErrorResponse("User not found", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    throw new ErrorResponse("Invalid token", 401);
  }
};

module.exports = authUser;
