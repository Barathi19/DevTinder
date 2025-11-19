const mongoose = require("mongoose");
const { CONNECTION_STATUS } = require("../constants");
const ErrorResponse = require("../utils/errorResponse");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: Object.values(CONNECTION_STATUS),
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  const { toUserId, fromUserId } = this;

  if (toUserId.equals(fromUserId)) {
    throw new ErrorResponse("Cannot send connection request to yourself!", 400);
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
