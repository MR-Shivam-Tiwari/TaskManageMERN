// authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("./Model/user"); // Update with the correct path

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Authentication failed. Token not provided." });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key"); // Use the same secret key you used for signing the token
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed. Invalid token." });
  }
};

module.exports = authMiddleware;
