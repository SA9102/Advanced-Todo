const express = require("express");

// Controllers
const tagController = require("../controllers/tag");

// Middleware
const { verifyAccessToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyAccessToken, tagController.getAllTags); // Get all tags that the user has created

router.post("/", verifyAccessToken, tagController.postTag); // Create a new tag

router.delete("/", verifyAccessToken, tagController.deleteTag);

module.exports = router;
