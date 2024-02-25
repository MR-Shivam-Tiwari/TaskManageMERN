const jwt = require("jsonwebtoken");
const User = require("./Model/user");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed. Token not provided." });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed. Invalid token." });
  }
};

module.exports = authMiddleware;
