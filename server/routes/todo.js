// Packages
const express = require("express");

// Controllers
const todoController = require("../controllers/todo");

// Middleware
const { verifyAccessToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyAccessToken, todoController.getAllTodos); // Get all todos by user ID

router.post("/", verifyAccessToken, todoController.createTodo); // Create a todo

router.put("/todo", verifyAccessToken, todoController.updateTodo); // Update a specific todo

router.put("/", verifyAccessToken, todoController.updateAllTodos); // Update all todos of a user

router.delete("/", todoController.deleteTodo);

module.exports = router;
