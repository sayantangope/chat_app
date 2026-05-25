const express = require("express");
const { validateEditProfileData } = require("../utils/validate");
const {
  getProfile,
  editProfile,
} = require("../controllers/user.controller");
const profileRouter= express.Router();

profileRouter.get("/profile", getProfile);

profileRouter.patch("/profile/edit", editProfile);


module.exports = profileRouter;
