const { validateUserId, validateFirstMessage } = require("../utils/validate");
const ConnectionRequest = require("../models/ConnectionRequest");
const { DEFAULT_STATUS } = require("../utils/constants");

const sendRequest = async (req, res) => {
  try {
    const user = req.user;
    const toUserId = req.params.toUserId;
    const status = DEFAULT_STATUS;
    const fromUserId = user._id;


  const  firstMessage = validateFirstMessage(req.body.firstMessage);

    // 1. prevent self request

    if (fromUserId.equals(toUserId)) {
      return res.status(400).json({
        message: "You cannot send request to yourself",
      });
    }

    // 2. check if userexist

    const targetUser = await validateUserId(toUserId);
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        message: "Connection request already exists",
      });
    }

    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
      firstMessage,
    });

    await newRequest.save();
    res.status(200).json({
      message: `${user.firstName} sent a ${status} request to ${targetUser.firstName}`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error: " + error.message);
  }
};

const reviewRequest = async (req, res) => {
  /* Checks to be made :
          - LoggedIn userID = touserId,
          - allowedStatus only accepted or rejected,
          - check only can change if the request is inetretd stage
        */

  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const isAllowedStatus = ["accepted", "rejected"];
    if (!isAllowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "pending",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    connectionRequest.status = status;

    await connectionRequest.save();
    res.json({
      message: "Connection request " + status + " successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  sendRequest,
  reviewRequest,
};
