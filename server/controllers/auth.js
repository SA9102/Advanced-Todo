const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      username: req.body.username,
    }).exec();
    if (existingUser) {
      return res.status(409).json({ msg: "Username already taken" });
    }
    const user = new User(req.body);
    user.save();
    res.status(200).json({ msg: "Account successfully created" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("1");
    const user = await User.findOne({ username: req.body.username }).exec();
    console.log("2");
    if (!user) {
      console.log("3");
      return res
        .status(401)
        .json({ message: "Invalid username and/or password" });
    }

    console.log("4");
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    console.log("5");
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "15d",
      }
    );
    console.log("6");
    user.refreshToken = refreshToken;
    await user.save();
    console.log("7");
    res
      .cookie("token", refreshToken, {
        httpOnly: true, // This prevents JavaScript from accessing the cookie via document.cookie. Helps protect against XSS attacks.
        secure: false, // If running on localhost, set this to false.
        sameSite: "Lax", // A
      })
      .json({ _id: user._id, accessToken });
  } catch (err) {
    console.log("8");
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
  console.log("IN REFRESH TOKEN");
  const cookies = req.cookies;
  // If the refresh token in the cookie is absent
  if (!cookies?.token) {
    console.log("UNAUTHORIZED");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.token;

  // Find the user in the database with this refresh token.
  const user = await User.findOne({ refreshToken }).exec();
  // If not found, then the given refresh token is invalid.
  if (!user) {
    console.log("FORBIDDEN");
    res.status(403).json({ message: "Forbidden" });
  }

  try {
    console.log("IN TRY");
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Verify that the user is indeed who they say they are
    if (user._id.toString() !== decoded.id) {
      console.log(user._id.toString());
      console.log(decoded.id);
      console.log("USER NOT EQUAL TO DECODED");
      return res.sendStatus(403);
    }

    // By this point, the refresh token is valid and the user is authorized, so
    // send a new access token.
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
