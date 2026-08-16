const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Notification = require("../models/Notification");
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// =====================================
// Raise Complaint
// =====================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and Description are required.",
      });
    }

    const complaint = new Complaint({
      worker: req.user.userId,
      title,
      description,
    });

    await complaint.save();

    const worker = await User.findById(req.user.userId);

    await Notification.create({
      title: "New Complaint Received",
      message: `${worker.name} submitted a new complaint.`,
      type: "Complaint",
    });

    res.status(201).json({
      message: "Complaint Submitted Successfully",
      complaint,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// =====================================
// Get Logged-in User Complaints
// =====================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      worker: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// =====================================
// Get Complaint By ID
// =====================================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }

    res.json(complaint);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// =====================================
// Delete Complaint
// =====================================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }

    if (complaint.worker.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      message: "Complaint Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;