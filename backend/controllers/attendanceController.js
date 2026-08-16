const Attendance = require("../models/Attendance");

// Worker Check In
exports.checkIn = async (req, res) => {
  try {
    const attendance = new Attendance({
      worker: req.user.id,
      checkIn: new Date().toLocaleTimeString(),
      status: "Present",
    });

    await attendance.save();

    res.status(201).json({
      message: "Check In Successful",
      attendance,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Worker Check Out
exports.checkOut = async (req, res) => {
  try {

    const attendance = await Attendance.findOne({
      worker: req.user.id,
    }).sort({ createdAt: -1 });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance not found",
      });
    }

    attendance.checkOut = new Date().toLocaleTimeString();

    await attendance.save();

    res.json({
      message: "Check Out Successful",
      attendance,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Attendance
exports.getAttendance = async (req, res) => {
  try {

    const attendance = await Attendance.find()
      .populate("worker", "name email");

    res.json(attendance);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};