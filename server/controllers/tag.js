const Tag = require("../models/Tag");
const jwt = require("jsonwebtoken");

exports.getAllTags = async (req, res) => {
  try {
    const decoded = jwt.verify(
      req.cookies.token,
      process.env.REFRESH_TOKEN_SECRET
    );

    const allTags = await Tag.find({ userId: decoded.id });

    return res.status(200).json({ data: allTags });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

exports.createTag = (req, res) => {
  try {
    const tag = new Tag(req.body.data);
    tag.save();
    return res.status(200);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};
