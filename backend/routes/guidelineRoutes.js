const express = require("express");

const router = express.Router();

const Guideline = require("../models/Guideline");

const authMiddleware = require("../middleware/authMiddleware");

// ==============================
// Worker Get Guidelines
// ==============================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const guidelines =
        await Guideline.find().sort({

          createdAt: -1,

        });

      res.json(guidelines);

    } catch (error) {

      res.status(500).json({

        message: "Server Error",

        error: error.message,

      });

    }

  }
);

module.exports = router;