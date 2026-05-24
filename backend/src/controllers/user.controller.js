const User = require("../models/User");
const { validateEditProfileData } = require("../utils/validate");

const getProfile = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
};

const editProfile = async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Some values cant be changed");
    }

    const allowedFields = ["firstName", "lastName", "username", "profileImage"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    await req.user.save();

    res.json({
      message: "Profile updated",
      user: req.user,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
         _id: {
    $ne: req.user._id
  },
      $or: [
        {
          username: {
            $regex: query,
            $options: "i",
          },
        },

        {
          firstName: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).select("firstName lastName username profileImage");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  editProfile,
  searchUsers,
};
