const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const validateAuthInput = ({ username, password }, isRegister = false) => {
  if (typeof username !== "string" || typeof password !== "string") {
    return "Username and password must be text values";
  }

  const trimmedUsername = username.trim();

  if (!trimmedUsername || !password) {
    return "Username and password are required";
  }

  if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
    return "Username must be between 3 and 30 characters";
  }

  if (isRegister && password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const validationError = validateAuthInput({ username, password }, true);

    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError,
      });
    }

    const trimmedUsername = username.trim();

    const existingUser = await User.findOne({ username: trimmedUsername });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Username already exists",
      });
    }

    const user = await User.create({
      username: trimmedUsername,
      password,
      role: role === "admin" ? "admin" : "user",
    });

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);

    return res.status(500).json({
      success: false,
      error: "Server error while registering",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const validationError = validateAuthInput({ username, password }, false);

    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError,
      });
    }

    const trimmedUsername = username.trim();

    const user = await User.findOne({ username: trimmedUsername }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      error: "Server error while logging in",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};