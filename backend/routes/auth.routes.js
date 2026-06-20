const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/auth.controller");
const { loginLimiter } = require("../middleware/rateLimit.middleware");

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);

module.exports = router;