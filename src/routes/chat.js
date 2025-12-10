const express = require("express");
const { validateGetChatHistory } = require("../utils/validate");
const authUser = require("../middleware/auth");
const Chat = require("../models/chat.model");

const chatRouter = express.Router();

const chatPopulate = [
  {
    path: "participants",
    select: "firstName lastName photoUrl",
  },
  {
    path: "messages.senderId",
    select: "firstName lastName",
  },
];

chatRouter.get(
  "/chat/:targetUserId",
  authUser,
  validateGetChatHistory,
  async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    chat = await chat.populate(chatPopulate);

    res.json({ success: true, data: chat });
  }
);

module.exports = chatRouter;
