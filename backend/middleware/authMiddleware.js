const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Token header se lo
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    // "Bearer token" me se token nikalo
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "workersecret123"
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token"
    });
  }
};

module.exports = authMiddleware;