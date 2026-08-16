require('dotenv').config();
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const wageRoutes = require("./routes/wageRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const alertRoutes = require("./routes/alertRoutes");
const guidelineRoutes = require("./routes/guidelineRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, req.body);
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/wages", wageRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/guidelines", guidelineRoutes);
app.use("/api/notifications", notificationRoutes);


app.get('/', (req, res) => {
  res.send('worker Safety System API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});