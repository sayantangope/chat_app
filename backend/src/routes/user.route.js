const express = require("express");
const {
  searchUsers,
  getUsers,
  getRequests,
  sentRequests,
} = require("../controllers/user.controller");
const userRouter = express.Router();


userRouter.get("/search", searchUsers);

userRouter.get("/feed",getUsers);

userRouter.get("/getRequests",getRequests);

userRouter.get("/sentRequest", sentRequests)


module.exports = userRouter;
