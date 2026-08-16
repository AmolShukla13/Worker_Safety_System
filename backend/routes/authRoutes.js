const authMiddleware = require("../middleware/authMiddleware");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const { sendOTPEmail } = require("../utils/emailService");

// 1. SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email: { $regex: new RegExp("^" + email.trim() + "$", "i") } });
    if (user) {
      return res.status(400).json({ message: 'This email is already registered!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email: email.toLowerCase().trim(), password: hashedPassword, role });
    await user.save();
    
    res.status(201).json({ message: 'User account created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
const { email, password, role } = req.body;

const user = await User.findOne({ email: { $regex: new RegExp("^" + email.trim() + "$", "i") } });

if (!user) {
  return res.status(400).json({
    message: "Invalid email or password!"
  });
}

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(400).json({
    message: "Invalid email or password!"
  });
}

if (role && user.role.toLowerCase() !== role.toLowerCase()) {
  return res.status(400).json({
    message: "Please select the correct role."
  });
}

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'workersecret123',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 3. GET PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});
// 4. UPDATE PROFILE
router.put("/profile", authMiddleware, async (req, res) => {

  try {

    const { name, phone, address, emergencyContact, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(

      req.user.userId,

      {
        name,
        phone,
        address,
        emergencyContact,
        profileImage,
      },

      {
        new: true,
      }

    ).select("-password");

    res.json({
      message: "Profile Updated Successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }

});

// 4. TOTAL WORKERS (Admin)
router.get("/total-workers", authMiddleware, async (req, res) => {
  try {

    // Sirf Admin access
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
const totalWorkers = await User.countDocuments({
  role: "worker",
});

    res.json({
      totalWorkers,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});
// ================================
// CHANGE PASSWORD
// ================================

router.put("/change-password", authMiddleware, async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(
      req.user.userId
    );

    if (!user) {

      return res.status(404).json({

        message: "User Not Found",

      });

    }

    const isMatch = await bcrypt.compare(

      currentPassword,

      user.password

    );

    if (!isMatch) {

      return res.status(400).json({

        message: "Current Password is Incorrect",

      });

    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(

      newPassword,

      salt

    );

    await user.save();

    res.json({

      message: "Password Updated Successfully",

    });

  } catch (error) {

    res.status(500).json({

      message: "Server Error",

      error: error.message,

    });

  }

});

// ===================================
// Upload Profile Image
// ===================================

router.post(
  "/upload-profile-image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {

    try {

      const user = await User.findById(
        req.user.userId
      );

      if (!user) {

        return res.status(404).json({
          message: "User not found",
        });

      }

      user.profileImage = "http://localhost:5000/uploads/" + req.file.filename;

      await user.save();

      res.json({

        message: "Profile Image Updated",

        image: user.profileImage,

      });

    } catch (error) {

      res.status(500).json({

        message: "Server Error",

        error: error.message,

      });

    }

  }
);

// ===================================
// FORGOT PASSWORD - REQUEST OTP
// ===================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address." });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiration to 15 minutes
    user.resetPasswordOTP = otp;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Send email / log OTP
    await sendOTPEmail(user.email, otp);

    res.json({
      message: `OTP sent successfully to ${email}. Check your inbox or server log.`,
      otp: otp, // return OTP for smooth dev testing
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ===================================
// RESET PASSWORD - VERIFY OTP & NEW PASSWORD
// ===================================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and New Password are required!" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP code!" });
    }

    if (Date.now() > user.resetPasswordExpire) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset OTP fields
    user.resetPasswordOTP = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({ message: "Password reset successful! You can now log in with your new password." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ===================================
// GET ADMIN PHONE (Public)
// ===================================
router.get("/admin-phone", async (req, res) => {
  try {
    const admin = await User.findOne({ email: "shuklaamulshukla@gmail.com" });
    res.json({ phone: admin?.phone || "+91 98765 43210" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;