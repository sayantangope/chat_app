const express = require("express");
const { validateEditProfileData } = require("../utils/validate");
const {
  getProfile,
  editProfile,
  searchUsers,
} = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.get("/profile", getProfile);

userRouter.patch("/profile/edit", editProfile);

userRouter.get("/search", searchUsers);

module.exports = userRouter;
