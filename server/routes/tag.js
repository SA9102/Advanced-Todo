const express = require("express");

// Controllers
const tagController = require("../controllers/tag");

// Middleware
const { verifyJWT } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyJWT, tagController.getAllTags); // Get all tags that the user has created

router.post("/", verifyJWT, tagController.createTag); // Create a new tag

module.exports = router;
