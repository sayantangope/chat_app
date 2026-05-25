const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "blocked"],
      default: "pending",
    },

    firstMessage: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);