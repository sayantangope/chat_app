const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    ConnectionRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConnectionRequest",
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    text: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
