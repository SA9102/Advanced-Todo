const express = require("express");
const jwt = require("jsonwebtoken");

// Controllers
const authController = require("../controllers/auth");

const { verifyJWT } = require("../middleware/auth");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);
// router.post("/logout", verifyJWT, authController.logout);

router.get("/refreshToken", authController.refreshToken);

module.exports = router;
