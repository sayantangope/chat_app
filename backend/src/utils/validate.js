const validator = require("validator");
const User = require("../models/User")

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

const validateUserId = async (toUserId)=> {
 const user = await User.findById(toUserId);
      if (!user) {
        throw new Error("User not found")
     }
     return user;
}

const validateFirstMessage = (firstMessage) => {
  const MIN_LENGTH = 2;
  const MAX_LENGTH = 500;

  if (!firstMessage || typeof firstMessage !== "string") {
    throw new Error("Message is required.");
  }

  const trimmed = firstMessage.trim();

  if (trimmed.length < MIN_LENGTH) {
    throw new Error(`Message must be at least ${MIN_LENGTH} characters.`);
  }
  if (trimmed.length > MAX_LENGTH) {
    throw new Error(`Message cannot exceed ${MAX_LENGTH} characters.`);
  }

  const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|EXEC|UNION|CREATE|REPLACE)\b|--|;|\/\*|\*\/|xp_|0x[0-9a-fA-F]+)/i;
  if (sqlPatterns.test(trimmed)) {
    throw new Error("Message contains invalid characters or keywords.");
  }

  const xssPatterns = /<\s*(script|iframe|object|embed|form|input|link|meta|style)[^>]*>|javascript\s*:|on\w+\s*=/i;
  if (xssPatterns.test(trimmed)) {
    throw new Error("Message contains invalid HTML or script content.");
  }

  const pathTraversalPatterns = /(\.\.[\/\\]|[\/\\]\.\.|%2e%2e|%252e)/i;
  if (pathTraversalPatterns.test(trimmed)) {
    throw new Error("Message contains invalid path sequences.");
  }

  const commandInjectionPatterns = /[`$|;&]|\$\(|\$\{|>\s*\/|<\s*\/dev/;
  if (commandInjectionPatterns.test(trimmed)) {
    throw new Error("Message contains invalid characters.");
  }


  return trimmed;
};
module.exports = {
  validateEditProfileData,
  validateUsername,
  validateUserId,
  validateFirstMessage,

};