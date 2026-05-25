const express = require("express");
const {
  searchUsers,
} = require("../controllers/user.controller");
const userRouter = express.Router();


userRouter.get("/search", searchUsers);



module.exports = userRouter;
