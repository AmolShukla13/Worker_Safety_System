const express = require("express");
const router = express.Router();

const Wage = require("../models/Wage");
const authMiddleware = require("../middleware/authMiddleware");

// Get logged-in worker wages
router.get("/mywages", authMiddleware, async (req, res) => {
  try {
    const wages = await Wage.find({
      worker: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(wages);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;