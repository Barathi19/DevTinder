const express = require("express");
const {
  validateUserConnectionRequest,
  validateReviewConnectionRequest,
} = require("../utils/validate");
const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");
const ConnectionRequest = require("../models/connectionRequest.model");
const { CONNECTION_STATUS } = require("../constants");
const authUser = require("../middleware/auth");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/request/send/:status/:userId",
  authUser,
  validateUserConnectionRequest,
  async (req, res) => {
    const { status, userId } = req.params;
    const { _id: fromUserId, firstName } = req.user;

    const toUser = await User.findById(userId);
    if (!toUser) {
      throw new ErrorResponse("User not found", 400);
    }

    const isAlreadyExist = await ConnectionRequest.findOne({
      $or: [
        { toUserId: userId, fromUserId },
        { toUserId: fromUserId, fromUserId: userId },
      ],
    });
    if (isAlreadyExist) {
      throw new ErrorResponse("Connection request already exist.", 409);
    }

    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId: userId,
      status,
    });

    await newConnectionRequest.save();

    let message = `${firstName} is interested in ${toUser.firstName}`;
    if (status === CONNECTION_STATUS.IGNORED) {
      message = `${firstName} ignored ${toUser.firstName}`;
    }

    res.status(200).json({ success: true, message });
  }
);

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  validateReviewConnectionRequest,
  async (req, res) => {
    const { status, requestId } = req.params;
    const userId = req.user._id;

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: userId,
      status: CONNECTION_STATUS.INTERESTED,
    });
    if (!connectionRequest) {
      throw new ErrorResponse("Connection request not found.", 404);
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({ success: true, message: "Connection request " + status, data });
  }
);

module.exports = connectionRequestRouter;
