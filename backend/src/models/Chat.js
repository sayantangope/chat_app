const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    firstMessage: {
      type: String,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Chat", chatSchema);
