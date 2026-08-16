const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// CHECK IN
// ==========================
router.post("/checkin", authMiddleware, async (req, res) => {
  try {
    const today = new Date().toDateString();

    const existingAttendance = await Attendance.findOne({
      worker: req.user.userId,
      date: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "You have already checked in today.",
      });
    }
const now = new Date();

let status = "Present";

// 9:15 AM ke baad Late
if (
  now.getHours() > 9 ||
  (now.getHours() === 9 && now.getMinutes() > 15)
) {
  status = "Late";
}

const attendance = new Attendance({
  worker: req.user.userId,
  checkIn: now.toLocaleTimeString(),
  status,
});

    await attendance.save();
    const worker = await User.findById(req.user.userId);

await Notification.create({
  title: "Attendance Check-In",
  message: "You checked in successfully.",
  type: "Attendance",
  worker: req.user.userId,
});

    res.status(201).json({
      message: "Check In Successful",
      attendance,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// ==========================
// CHECK OUT
// ==========================
router.put("/checkout", authMiddleware, async (req, res) => {
  try {
    const today = new Date().toDateString();

    const attendance = await Attendance.findOne({
      worker: req.user.userId,
      date: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Please Check In first."
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: "You have already checked out today."
      });
    }

    attendance.checkOut = new Date().toLocaleTimeString();

    await attendance.save();
    const worker = await User.findById(req.user.userId);

await Notification.create({
  title: "Attendance Check-Out",
  message: "You checked out successfully.",
  type: "Attendance",
  worker: req.user.userId,
});


    res.json({
      message: "Check Out Successful",
      attendance,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// ==========================
// GET MY ATTENDANCE
// ==========================
router.get("/myattendance", authMiddleware, async (req, res) => {
  try {

    const attendance = await Attendance.find({
      worker: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(attendance);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
});

module.exports = router;