const jwt = require("jsonwebtoken");

// Checks the presence of a JWT. If present, then check if valid.
// If so, then return the user data from the JWT.
exports.verifyJWT = (req, res, next) => {
  const token = req.headers.authorization;
  // If token is not present
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id; // Attach the extracted user data to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
