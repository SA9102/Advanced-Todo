const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const user = new User(req.body);
  user.save();
  res.json({ message: "Success" });
};

exports.login = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ username: req.body.username }).exec();
    console.log("USER");
    console.log(user);
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid username and/or password" });

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "5m",
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    console.log(refreshToken);
    user.refreshToken = refreshToken;
    await user.save();
    res
      .cookie("token", refreshToken, {
        httpOnly: true, // This prevents JavaScript from accessing the cookie via document.cookie. Helps protect against XSS attacks.
        secure: false, // If running on localhost, set this to false.
        sameSite: "Lax", // A
      })
      .json({ _id: user._id, accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.token) {
    return res.status(204);
  }
  const refreshToken = cookies.token;

  const user = await User.findOne({ refreshToken }).exec();
  if (!user) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    return res.sendStatus(204);
  }

  user.refreshToken = "";
  await user.save();

  res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "Lax" });
  return res.sendStatus(204);
};

exports.refreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(req.cookies.jwt);
  if (!cookies?.token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const refreshToken = cookies.token;

  const user = await User.findOne({ refreshToken }).exec();
  if (!user) {
    res.status(403).json({ message: "Forbidden" });
  }
  console.log(refreshToken);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (user._id !== decoded._id) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    return res.json({ _id: user._id, username: user.username, accessToken });
  } catch (err) {
    console.log(err);
    // return res.sendStatus(403);
  }
};
