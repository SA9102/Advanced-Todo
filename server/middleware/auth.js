const jwt = require("jsonwebtoken");

// Checks the presence of a JWT. If present, then check if valid.
// If so, then return the user data from the JWT.
exports.verifyJWT = (req, res, next) => {
  console.log("REQ HEADERS AUTH:");
  console.log(req.headers.authorization);
  console.log("1");
  const token = req.headers.authorization;
  console.log("2");
  // If token is not present
  if (!token) {
    console.log("3");
    return res.status(401).json({ message: "No token" });
  }
  console.log("4");
  console.log(token);
  try {
    console.log("5");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("6");
    req.userId = decoded.id; // Attach the extracted user data to the request object
    console.log("7");
    next();
  } catch (err) {
    console.log("8");
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
