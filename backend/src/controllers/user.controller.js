const { clerkClient } = require("@clerk/express");
const User = require("../models/User");
const { validateEditProfileData } = require("../utils/validate");
const ConnectionRequest = require("../models/ConnectionRequest");
const { DEFAULT_STATUS } = require("../utils/constants");
const USER_SAFE_DATA = "firstName lastName age profileImage "
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

    const { clerkId } = req.user;

    const allowedFields = ["firstName", "lastName", "username", "profileImage"];

    const params = {};

    allowedFields.forEach((field) => {
      if (field in req.body) {
        params[field] = req.body[field];
        req.user[field] = req.body[field];
      }
    });
    await clerkClient.users.updateUser(clerkId, params);
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
        $ne: req.user._id,
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

const getUsers = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userId = loggedInUser._id;

    const received = await ConnectionRequest.countDocuments({
      toUserId: userId,
      status: "pending",
    });

    const sent = await ConnectionRequest.countDocuments({
      fromUserId: userId,
      status: "pending",
    });

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: userId, status: "accepted" },
        { fromUserId: userId, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) =>
      row.toUserId.equals(userId) ? row.fromUserId : row.toUserId
    );

    res.status(200).json({
      data,
      received,
      sent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ConnectionRequest.find({
      toUserId: userId,
      status: DEFAULT_STATUS,
    }).select(`fromUserId startMessage ${USER_SAFE_DATA}`);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sentRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await ConnectionRequest.find({
      fromUserId: userId,
      status: DEFAULT_STATUS,
    }).select(`toUserId startMessage ${USER_SAFE_DATA}`);

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getProfile,
  editProfile,
  searchUsers,
  getUsers,
  getRequests,
  sentRequests
};
