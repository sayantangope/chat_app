const { getAuth } = require("@clerk/express");
const { clerkClient } = require("@clerk/express");
const User = require("../models/User"); // ✅ import your model

const userAuth = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId: userId }); // ✅ userId, not clerkId

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        profileImage: clerkUser.imageUrl || "",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message); // ✅ log the real error
    return res.status(500).json({ error: "Auth middleware failed" });
  }
};

module.exports = userAuth;