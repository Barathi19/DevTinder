const express = require("express");
const authUser = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest.model");
const { CONNECTION_STATUS, USER_SAFE_DATA } = require("../constants");
const User = require("../models/user.model");

const userRouter = express.Router();

userRouter.get("/user/requests/received", authUser, async (req, res) => {
  const userId = req.user._id;

  const requests = await ConnectionRequest.find({
    toUserId: userId,
    status: CONNECTION_STATUS.INTERESTED,
  }).populate("fromUserId", USER_SAFE_DATA);

  res.status(200).json({ success: true, data: requests });
});

userRouter.get("/user/connections", authUser, async (req, res) => {
  const userId = req.user._id;

  const connections = await ConnectionRequest.find({
    $or: [{ fromUserId: userId }, { toUserId: userId }],
    status: CONNECTION_STATUS.ACCEPTED,
  })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

  const data = connections.map((row) => {
    if (row.fromUserId._id.toString() === userId.toString()) {
      return row.toUserId;
    }
    return row.fromUserId;
  });

  res.json({ success: true, data });
});

userRouter.get("/user/feed", authUser, async (req, res) => {
  const userId = req.user._id;
  const { page: pageFromQuery, limit: limitFromQuery } = req.query;

  const page = parseInt(pageFromQuery) || 1;
  let limit = parseInt(limitFromQuery) || 10;
  limit = limit < 50 ? limit : 50;
  const skip = (page - 1) * limit;

  const existConnection = await ConnectionRequest.find({
    $or: [{ fromUserId: userId }, { toUserId: userId }],
  }).select("fromUserId toUserId");

  const hideFromFeed = new Set();
  existConnection.forEach(({ fromUserId, toUserId }) => {
    hideFromFeed.add(fromUserId.toString());
    hideFromFeed.add(toUserId.toString());
  });

  const feeds = await User.find({
    $and: [
      { _id: { $nin: Array.from(hideFromFeed) } },
      { _id: { $ne: userId } },
    ],
  })
    .skip(skip)
    .limit(limit)
    .select(USER_SAFE_DATA);

  res.status(200).json({ success: true, data: feeds });
});

module.exports = userRouter;
