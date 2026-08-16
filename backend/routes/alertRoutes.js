const express = require("express");
const router = express.Router();

const Alert = require("../models/Alert");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// Worker - Get All Alerts
// ==========================
router.get("/", authMiddleware, async (req, res) => {

  try {

    const alerts = await Alert.find().sort({
      createdAt: -1,
    });

    res.json(alerts);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});

module.exports = router;