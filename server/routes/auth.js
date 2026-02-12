const express = require("express");

// Controllers
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/refreshToken", authController.refreshToken);

module.exports = router;
