const express = require("express");
const { validateEditProfileData } = require("../utils/validate");
const userRouter = express.Router();

userRouter.get("/profile", (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
});

userRouter.post("/profile/edit",async(req,res)=> {
    try {
        if(!validateEditProfileData(req)) {
             throw new Error("Some values cant be changed");
        }

        const allowedFields = ["firstName", "lastName", "username", "profileImage"];
        allowedFields.forEach((field) => {
          if (req.body[field] !== undefined) {
            req.user[field] = req.body[field];
          }
        });

        await req.user.save();

        res.json({ message: "Profile updated", user: req.user });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = userRouter;
