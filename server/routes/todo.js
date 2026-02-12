// Packages
const express = require("express");

// Controllers
const todoController = require("../controllers/todo");

// Middleware
const { verifyJWT } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyJWT, todoController.getAllTodos); // Get all todos by user ID

router.post("/", verifyJWT, todoController.createTodo); // Create a todo

router.put("/todo", verifyJWT, todoController.updateTodo); // Update a specific todo

router.put("/", verifyJWT, todoController.updateAllTodos); // Update all todos of a user

router.delete("/", todoController.deleteTodo);

module.exports = router;
