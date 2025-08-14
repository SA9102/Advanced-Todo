require("dotenv").config();
const jwt = require("jsonwebtoken");


module.exports.createToken = (user) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
};
