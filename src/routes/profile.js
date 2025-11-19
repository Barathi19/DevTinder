const express = require("express");
const authUser = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validate");

const profileRouter = express.Router();

profileRouter.get("/profile/view", authUser, (req, res) => {
  const user = req.user;
  res.send({ success: true, data: user.getDetail() });
});

profileRouter.patch(
  "/profile",
  authUser,
  validateEditProfileData,
  async (req, res) => {
    const dateToUpdate = req.body;
    const user = req.user;

    Object.assign(user, dateToUpdate);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated succesfully.",
      data: user.getDetail(),
    });
  }
);

module.exports = profileRouter;
