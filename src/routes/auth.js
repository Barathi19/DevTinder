const express = require("express");
const { validateSignUpData } = require("../utils/validate");
const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");

const authRouter = express.Router();

authRouter.post("/signup", validateSignUpData, async (req, res) => {
  const user = new User(req.body);
  await user.save();

  const token = user.getJWT();

  res
    .status(200)
    .cookie("token", token, { expires: new Date(Date.now() + 24 * 3600000) })
    .json({
      success: true,
      message: "User created successfully!",
      data: user.getDetail(),
    });
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    throw new ErrorResponse("Invalid credentials", 400);
  }

  const user = await User.findOne({ emailId });

  if (!user) {
    throw new ErrorResponse("User not found.", 404);
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new ErrorResponse("Invalid credentials", 400);
  }

  const token = user.getJWT();

  res
    .status(200)
    .cookie("token", token, { expires: new Date(Date.now() + 24 * 3600000) })
    .json({
      success: true,
      message: "Logged In successfully.",
      data: user.getDetail(),
    });
});

authRouter.post("/logout", async (_, res) => {
  res
    .status(200)
    .clearCookie("token")
    .json({ success: true, message: "Logged out successfully." });
});

module.exports = authRouter;
