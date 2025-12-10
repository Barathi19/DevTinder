const { Server } = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat.model");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-chat", ({ firstName, userId, targetUserId }) => {
      console.log(`${firstName} joined.`);

      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "send-message",
      async ({ firstName, userId, targetUserId, text }) => {
        console.log(`sender: ${firstName}, text: ${text}`);

        const roomId = getSecretRoomId(userId, targetUserId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();

        io.to(roomId).emit("receive-message", { firstName, text });
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected...");
    });
  });
};

module.exports = { initializeSocket };
