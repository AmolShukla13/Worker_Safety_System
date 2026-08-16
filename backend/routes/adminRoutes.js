const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const Complaint = require("../models/Complaint");
const Attendance = require("../models/Attendance");
const Wage = require("../models/Wage");
const Notification = require("../models/Notification");
const upload = require("../middleware/uploadMiddleware");
const Alert = require("../models/Alert");
const Guideline = require("../models/Guideline");

// ==========================
// Get All Workers
// ==========================
router.get("/workers", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const workers = await User.find({
      role: "worker",
    }).select("-password");

    res.json(workers);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
});


// ==========================
// Add Worker
// ==========================
router.post("/workers", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = new User({
      name,
      email,
      password: hashedPassword,
      role: "worker",
    });

    await worker.save();
    await Notification.create({
      title: "New worker Added",
      message: `${worker.name} has been added successfully.`,
      type: "worker",
    });

    res.status(201).json(worker);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================
// Update Worker
// ==========================
router.put("/workers/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const { name, email } = req.body;

    const worker = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
      },
      {
        new: true,
      }
    );

    if (!worker) {
      return res.status(404).json({
        message: "Worker Not Found",
      });
    }

    res.json(worker);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================
// Delete Worker
// ==========================
router.delete("/workers/:id", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const worker = await User.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        message: "Worker Not Found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "Worker Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
});




// ==========================
// Get Notifications
// ==========================
router.get("/notifications", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(notifications);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
});

// ==========================
// Add Wage
// ==========================
router.post("/wages", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const {
      worker,
      month,
      amount,
      overtime,
      status,
    } = req.body;

    const wage = new Wage({
      worker,
      month,
      amount,
      overtime,
      status,
    });

    await wage.save();

    const workerData = await User.findById(worker);

    await Notification.create({
  title: "Salary Updated",
  message: "Your salary has been updated successfully.",
  type: "Wage",

  worker: workerData._id,
});

    res.status(201).json({
      message: "Wage Added Successfully",
      wage,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});

// ==========================
// Update Wage
// ==========================
router.put("/wages/:id", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const {
      month,
      amount,
      overtime,
      status,
    } = req.body;

    const wage = await Wage.findByIdAndUpdate(
      req.params.id,
      {
        month,
        amount,
        overtime,
        status,
      },
      {
        new: true,
      }
    );

    if (!wage) {
      return res.status(404).json({
        message: "Wage Record Not Found",
      });
    }

    const workerData = await User.findById(wage.worker);

    await Notification.create({
  title: "Salary Updated",
  message: "Your salary details have been updated.",
  type: "Wage",

  worker: workerData._id,
});

    res.json({
      message: "Wage Updated Successfully",
      wage,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==========================
// Delete Wage
// ==========================
router.delete("/wages/:id", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const wage = await Wage.findById(req.params.id);

    if (!wage) {
      return res.status(404).json({
        message: "Wage Record Not Found",
      });
    }

    const workerData = await User.findById(wage.worker);

    await Wage.findByIdAndDelete(req.params.id);

    await Notification.create({
  title: "Salary Deleted",
  message: "Your salary record has been deleted.",
  type: "Wage",

  worker: workerData._id,
});

    res.json({
      message: "Wage Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});

// ==========================
// Get Workers For Wage Form
// ==========================
router.get("/workers-list", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const workers = await User.find(
      { role: "worker" },
      "name email"
    );

    res.json(workers);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});

// ==========================
// Get All Wages
// ==========================
router.get("/wages", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const wages = await Wage.find()
      .populate("worker", "name email")
      .sort({ createdAt: -1 });

    res.json(wages);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});

// ==========================
// Mark All Notifications Read
// ==========================
router.put("/notifications/read", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );

    res.json({
      message: "All Notifications Marked Read",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});

// ==========================
// Delete Notification
// ==========================
router.delete("/notifications/:id", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      message: "Notification Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==========================
// Admin Profile
// ==========================
router.get("/profile", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const admin = await User.findById(req.user.userId).select("-password");

// Workers
const totalWorkers = await User.countDocuments({
  role: "worker",
});

// Today's Attendance
const today = new Date();

today.setHours(0,0,0,0);

const tomorrow = new Date(today);

tomorrow.setDate(today.getDate()+1);

const totalAttendance =
await Attendance.countDocuments({

  date: {

    $gte: today,

    $lt: tomorrow,

  },

  status: {

    $in: ["Present", "Late"],

  },

});

// Complaints
const totalComplaints =
await Complaint.countDocuments();

const resolvedComplaints =
await Complaint.countDocuments({

status:"Resolved",

});

// Wage Amount
const wages =
await Wage.find();

const totalWages =
wages.reduce(

(sum,item)=>

sum+Number(item.amount||0),

0

);

const paidAmount=
wages

.filter(

item=>item.status==="Paid"

)

.reduce(

(sum,item)=>

sum+Number(item.amount),

0

);

const pendingAmount=

totalWages-paidAmount;

// Attendance Percentage

const attendancePercent=

totalWorkers===0

?0

:Math.round(

(totalAttendance/

totalWorkers)*100

);

res.json({

  admin,

  totalWorkers,

  totalAttendance,

  attendancePercent,

  totalComplaints,

  resolvedComplaints,

  totalWages,

  paidAmount,

  pendingAmount,

});

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==========================
// Update Admin Profile
// ==========================
router.put("/profile", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const {
      name,
      email,
      phone,
      profileImage,
    } = req.body;

    const admin = await User.findById(req.user.userId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin Not Found",
      });
    }

    admin.name = name;
    admin.email = email;
    admin.phone = phone;
    if (profileImage) {
      admin.profileImage = profileImage;
    }

    await admin.save();

    res.json({
      message: "Profile Updated Successfully",
      admin,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==========================
// Change Password
// ==========================
router.put("/change-password", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const admin = await User.findById(req.user.userId);

    if (!admin) {
      return res.status(404).json({
        message: "Admin Not Found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current Password is Incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);

    admin.password = await bcrypt.hash(
      newPassword,
      salt
    );

    await admin.save();

    res.json({
      message: "Password Changed Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});

// ==========================
// Get Attendance (Present + Absent)
// ==========================
router.get("/attendance", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    // Sab workers nikalo
    const workers = await User.find({
      role: "worker",
    }).select("name email");

    // Aaj ki date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Sirf aaj ki attendance
    const attendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate("worker", "name email");

    // Final list
    const finalAttendance = workers.map((worker) => {

      const record = attendance.find(
        (item) =>
          item.worker &&
          item.worker._id.toString() === worker._id.toString()
      );

      if (record) {

        return {
          _id: record._id,
          worker: record.worker,
          date: record.date,
          checkIn: record.checkIn,
          checkOut: record.checkOut,
          status: record.status,
        };

      }

      return {
        _id: worker._id,
        worker,
        date: today,
        checkIn: "--",
        checkOut: "--",
        status: "Absent",
      };

    });

    res.json(finalAttendance);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==========================
// Get All Complaints (Admin)
// ==========================
router.get("/complaints", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const complaints = await Complaint.find()
      .populate("worker", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==========================
// Update Complaint Status
// ==========================
router.put("/complaints/:id", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found",
      });
    }

    // Pending -> In Progress
    if (complaint.status === "Pending") {

      complaint.status = "In Progress";

    }

    // In Progress -> Resolved
    else if (complaint.status === "In Progress") {

      complaint.status = "Resolved";

    }

    await complaint.save();

    res.json({
      message: "Complaint Status Updated Successfully",
      complaint,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==========================
// Delete Complaint (Admin)
// ==========================
router.delete("/complaints/:id", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found",
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
// ==========================
// Upload Profile Image
// ==========================
router.put(
  "/profile/image",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {

      if (req.user.role !== "Admin") {
        return res.status(403).json({
          message: "Access Denied",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No Image Selected",
        });
      }

      const admin = await User.findById(req.user.userId);

      if (!admin) {
        return res.status(404).json({
          message: "Admin Not Found",
        });
      }

      console.log("Uploaded File:", req.file);

      admin.profileImage = "http://localhost:5000/uploads/" + req.file.filename;

      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Image Uploaded Successfully",
        profileImage: admin.profileImage,
      });

    } catch (err) {

      console.log(err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });

    }
  }
);
// ==========================
// Create Safety Alert
// ==========================
router.post("/alerts", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const { title, message, priority } = req.body;

    const alert = new Alert({
      title,
      message,
      priority,
    });

    await alert.save();

    res.status(201).json({
      message: "Safety Alert Created Successfully",
      alert,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==========================
// Get All Safety Alerts
// ==========================
router.get("/alerts", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

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
// ==========================
// Update Safety Alert
// ==========================
router.put("/alerts/:id", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const { title, message, priority } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        title,
        message,
        priority,
      },
      {
        new: true,
      }
    );

    if (!alert) {
      return res.status(404).json({
        message: "Alert Not Found",
      });
    }

    res.json({
      message: "Alert Updated Successfully",
      alert,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==========================
// Delete Safety Alert
// ==========================
router.delete("/alerts/:id", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        message: "Alert Not Found",
      });
    }

    await Alert.findByIdAndDelete(req.params.id);

    res.json({
      message: "Alert Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});
// ==============================
// Add Guideline
// ==============================

router.post(
  "/guidelines",
  authMiddleware,
  async (req, res) => {

    try {

      if (req.user.role !== "Admin") {

        return res.status(403).json({
          message: "Access Denied",
        });

      }

      const guideline =
        await Guideline.create({

          title:
            req.body.title,

          description:
            req.body.description,

          category:
            req.body.category,

        });

      res.status(201).json({
        message:
          "Guideline Added Successfully",

        guideline,

      });

    } catch (error) {

      res.status(500).json({

        message:
          "Server Error",

        error:
          error.message,

      });

    }

  }
);
// ==============================
// Get All Guidelines
// ==============================

router.get(
  "/guidelines",
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

        message:
          "Server Error",

        error:
          error.message,

      });

    }

  }
);
// ==============================
// Update Guideline
// ==============================

router.put(
  "/guidelines/:id",
  authMiddleware,
  async (req, res) => {

    try {

      if (req.user.role !== "Admin") {

        return res.status(403).json({
          message: "Access Denied",
        });

      }

      const guideline =
        await Guideline.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
          }

        );

      if (!guideline) {

        return res.status(404).json({
          message: "Guideline Not Found",
        });

      }

      res.json({
        message: "Guideline Updated Successfully",
        guideline,
      });

    } catch (error) {

      res.status(500).json({
        message: "Server Error",
        error: error.message,
      });

    }

  }
);
// ==============================
// Delete Guideline
// ==============================

router.delete(
  "/guidelines/:id",
  authMiddleware,
  async (req, res) => {

    try {

      if (req.user.role !== "Admin") {

        return res.status(403).json({
          message: "Access Denied",
        });

      }

      const guideline =
        await Guideline.findByIdAndDelete(
          req.params.id
        );

      if (!guideline) {

        return res.status(404).json({
          message: "Guideline Not Found",
        });

      }

      res.json({
        message: "Guideline Deleted Successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: "Server Error",
        error: error.message,
      });

    }

  }
);

// ===============================
// Dashboard Statistics
// ===============================
router.get("/dashboard-stats", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {

      return res.status(403).json({
        message: "Access Denied",
      });

    }

    const totalWorkers = await User.countDocuments({
      role: "worker",
    });

    const today = new Date();

    today.setHours(0,0,0,0);

    const tomorrow = new Date(today);

    tomorrow.setDate(today.getDate()+1);

    const totalAttendance = await Attendance.countDocuments({

      date:{
        $gte:today,
        $lt:tomorrow,
      },

      status:{
        $in:["Present","Late"],
      }

    });

    const totalComplaints =
    await Complaint.countDocuments();

    const resolvedComplaints =
    await Complaint.countDocuments({

      status:"Resolved",

    });

    const wages =
    await Wage.find();

    const totalWages =
    wages.reduce(

      (sum,item)=>

      sum+Number(item.amount||0),

      0

    );

    const wageRecords =
    await Wage.countDocuments();

    const paidAmount =
    wages

    .filter(

      item=>item.status==="Paid"

    )

    .reduce(

      (sum,item)=>

      sum+Number(item.amount||0),

      0

    );

    const pendingAmount =
    totalWages-paidAmount;

    const attendancePercent =
    totalWorkers===0

    ?0

    :Math.round(

      (totalAttendance/

      totalWorkers)*100

    );

    res.json({

      totalWorkers,

      totalAttendance,

      attendancePercent,

      totalComplaints,

      resolvedComplaints,

      totalWages,

      wageRecords,

      paidAmount,

      pendingAmount,

    });

  }

  catch(error){

    res.status(500).json({

      message:"Server Error",

      error:error.message,

    });

  }

});
// ===============================
// Recent Activities
// ===============================
router.get("/recent-activities", authMiddleware, async (req, res) => {

  try {

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    const attendance = await Attendance.find()
      .populate("worker", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    const complaints = await Complaint.find()
      .populate("worker", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    const wages = await Wage.find()
      .populate("worker", "name")
      .sort({ createdAt: -1 })
      .limit(3);

    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(2);

    const guidelines = await Guideline.find()
      .sort({ createdAt: -1 })
      .limit(2);

    let activities = [];

    attendance.forEach(item => {

      activities.push({

        icon: "👷",

        title: "Worker Checked In",

        message: item.worker
          ? `${item.worker.name} checked in`
          : "Worker Checked In",

        time: item.createdAt,

      });

    });

    complaints.forEach(item => {

      activities.push({

        icon: "⚠️",

        title: "New Complaint",

        message: item.worker
          ? `${item.worker.name} submitted complaint`
          : "Complaint Submitted",

        time: item.createdAt,

      });

    });

    wages.forEach(item => {

      activities.push({

        icon: "💰",

        title: "Salary Updated",

        message: item.worker
          ? `Salary updated for ${item.worker.name}`
          : "Salary Updated",

        time: item.createdAt,

      });

    });

    alerts.forEach(item => {

      activities.push({

        icon: "🛡",

        title: "Safety Alert",

        message: item.title,

        time: item.createdAt,

      });

    });

    guidelines.forEach(item => {

      activities.push({

        icon: "📘",

        title: "New Guideline",

        message: item.title,

        time: item.createdAt,

      });

    });

    activities.sort(

      (a, b) => new Date(b.time) - new Date(a.time)

    );

    res.json(

      activities.slice(0, 4)

    );

  } catch (error) {

    res.status(500).json({

      message: "Server Error",

      error: error.message,

    });

  }

});
module.exports = router;   