const adminMiddleware = (req, res, next) => {
  try {
    // req.user comes from authMiddleware
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

module.exports = adminMiddleware;