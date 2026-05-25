const express = require("express");
const {
  sendRequest,
  reviewRequest,
} = require("../controllers/request.controller");
const requestRouter = express.Router();

requestRouter.post("/request/send/:toUserId", sendRequest);

requestRouter.post("/request/review/:requestId", reviewRequest);

module.exports = requestRouter;
