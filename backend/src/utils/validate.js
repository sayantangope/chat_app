const validator = require("validator");

const validateUsername = (username) => {
  if (!username) {
    throw new Error("Username is required");
  }

  if (username.length < 3 || username.length > 30) {
    throw new Error("Username must be between 3 and 30 characters");
  }

  const validUsernameRegex = /^[a-zA-Z0-9_]+$/;

  if (!validUsernameRegex.test(username)) {
    throw new Error(
      "Username can only contain letters, numbers, and underscores",
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "username",
    "profileImage",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFields.includes(field),
  );

  if (!isEditAllowed) {
    throw new Error("Invalid update fields");
  }

  const { username, firstName, lastName, profileImage } = req.body;

  if (username) {
    validateUsername(username);
  }

  if (firstName && firstName.length > 50) {
    throw new Error("First name too long");
  }

  if (lastName && lastName.length > 50) {
    throw new Error("Last name too long");
  }

  if (profileImage && !validator.isURL(profileImage)) {
    throw new Error("Invalid profile image URL");
  }

  return true;
};

module.exports = {
  validateEditProfileData,
  validateUsername,
};