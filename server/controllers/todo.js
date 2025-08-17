const Todo = require("../models/Todo");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Get all todos of a particular user
exports.getAllTodos = async (req, res) => {
  const decoded = jwt.verify(
    req.cookies.token,
    process.env.REFRESH_TOKEN_SECRET
  );
  const userId = decoded.id;
  try {
    // const user = await User.findOne({ _id: userId });
    const todos = await Todo.find({ userId });
    return res.status(200).json({ data: todos });
  } catch (err) {
    console.log("server error");
    return res.status(500).json({ err: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    await Todo.findOneAndUpdate(
      { taskId: req.body.data.taskId },
      req.body.data
    );
    return res.status(200).json({ message: "Update successful" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
// This deletes all todos, then adds in the
// ones passed in through the request body.
exports.updateAllTodos = async (req, res) => {
  try {
    // First, delete all todos created by the user
    await Todo.deleteMany({ userId: req.body._id });
    // Then, add in
    await Todo.insertMany(req.body.data);
    return res.json({ message: "Success" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
