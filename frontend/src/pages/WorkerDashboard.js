import "../styles/WorkerDashboard.css";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


function WorkerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [wages, setWages] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [updates, setUpdates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setError("");
     const [
  profileRes,
  attendanceRes,
  wagesRes,
  complaintsRes,
  alertsRes,
] = await Promise.all([
  API.get("/auth/profile"),
  API.get("/attendance/myattendance"),
  API.get("/wages/mywages"),
  API.get("/complaints"),
  API.get("/alerts"),
]);

      setUser(profileRes.data);
      setAttendance(attendanceRes.data || []);
      setWages(wagesRes.data || []);
      setComplaints(complaintsRes.data || []);
      setUpdates(alertsRes.data || []);
    } catch (err) {
      console.log(err);
      setError("Dashboard data load nahi ho payi. Backend check karein.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const todayStr = new Date().toDateString();
  const todayAttendance = attendance.find(
    (a) => new Date(a.date).toDateString() === todayStr
  );

  const latestWage = wages[0];
  const activeComplaints = complaints.filter(
    (c) => c.status !== "Resolved"
  ).length;

  const presentDays = attendance.filter((a) => a.status !== "Absent").length;
  const safetyScore = attendance.length
    ? Math.max(
        40,
        Math.min(
          100,
          Math.round((presentDays / attendance.length) * 100) -
            activeComplaints * 5
        )
      )
    : 100;

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      await API.post("/attendance/checkin");
      await loadDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in fail ho gaya.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      await API.put("/attendance/checkout");
      await loadDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out fail ho gaya.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="worker-dashboard">
        <div className="dashboard-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="worker-dashboard">
      {error && <div className="dashboard-error">{error}</div>}

      <motion.div
        className="hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-left">
          <h1>Hello, {user ? user.name : "Worker"} 👋</h1>
          <p>Stay safe today to build a better tomorrow.</p>
        </div>
      </motion.div>

      <div className="cards">
        <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
          <div className="icon-circle green">✅</div>
          <h3>Today's Attendance</h3>
          <h1>{todayAttendance ? todayAttendance.status : "Not Marked"}</h1>
          <p>
            {todayAttendance
              ? `Checked in at ${todayAttendance.checkIn || "-"}`
              : "You haven't checked in today"}
          </p>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
          <div className="icon-circle purple">💰</div>
          <h3>Latest Wage</h3>
          <h1>{latestWage ? `₹${latestWage.amount}` : "N/A"}</h1>
          <p>
            {latestWage
              ? `${latestWage.status} • ${new Date(
                  latestWage.paymentDate
                ).toLocaleDateString()}`
              : "No wage record yet"}
          </p>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
          <div className="icon-circle orange">⚠️</div>
          <h3>Active Complaints</h3>
          <h1>{activeComplaints}</h1>
          <p onClick={() => navigate("/complaints")} className="link-text">
            View your complaints
          </p>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
          <div className="icon-circle blue">🛡️</div>
          <h3>Safety Score</h3>
          <h1>{safetyScore}%</h1>
          <p>Keep it up!</p>
        </motion.div>
      </div>

      <div className="dashboard-grid">
        <div className="attendance-panel">
          <h2>Today's Attendance</h2>

          <div className="attendance-box">
            <div>
              <h3>Check In</h3>
              <h1>{todayAttendance ? todayAttendance.checkIn || "-" : "-"}</h1>
            </div>

            <div>
              <h3>Check Out</h3>
              <h1>{todayAttendance ? todayAttendance.checkOut || "-" : "-"}</h1>
            </div>
          </div>

          {!todayAttendance && (
            <button
              className="primary-btn"
              onClick={handleCheckIn}
              disabled={actionLoading}
            >
              {actionLoading ? "Please wait..." : "Check In Now"}
            </button>
          )}

          {todayAttendance && !todayAttendance.checkOut && (
            <button
              className="primary-btn"
              onClick={handleCheckOut}
              disabled={actionLoading}
            >
              {actionLoading ? "Please wait..." : "Check Out Now"}
            </button>
          )}

          {todayAttendance && todayAttendance.checkOut && (
            <button
              className="primary-btn"
              onClick={() => navigate("/attendance")}
            >
              View Attendance History →
            </button>
          )}
        </div>

        <div className="updates-panel">
          <h2>Recent Updates</h2>

          {
  updates.length === 0 ? (

    <div className="update-item">
      No Recent Updates
    </div>

  ) : (

    updates.slice(0,4).map((item)=>(

      <div
        className="update-item"
        key={item._id}
      >

        <strong>

          {item.title}

        </strong>

        <br/>

        {item.message}

      </div>

    ))

  )
}
      </div>

      </div>

      <h2 className="section-title">Quick Actions</h2>

      <div className="actions">
        <div className="action-card" onClick={() => navigate("/profile")}>
          <div>
            <h3>👤 View Profile</h3>
            <p>Update your details</p>
          </div>
          <span>›</span>
        </div>

        <div className="action-card" onClick={() => navigate("/wages")}>
          <div>
            <h3>💰 My Wages</h3>
            <p>View payment history</p>
          </div>
          <span>›</span>
        </div>

        <div className="action-card" onClick={() => navigate("/complaints")}>
          <div>
            <h3>⚠️ My Complaints</h3>
            <p>Raise or track complaints</p>
          </div>
          <span>›</span>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/safety-guidelines")}
        >
          <div>
            <h3>🛡️ Safety Guidelines</h3>
            <p>Read latest safety rules</p>
          </div>
          <span>›</span>
        </div>
      </div>
    </div>
  );
}

export default WorkerDashboard;