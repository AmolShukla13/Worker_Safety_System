import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";


function AdminDashboard() {
  const navigate = useNavigate();
const [stats,setStats]=useState({

totalWorkers:0,

totalAttendance:0,

attendancePercent:0,

totalComplaints:0,

resolvedComplaints:0,

totalWages:0,

wageRecords:0,

paidAmount:0,

pendingAmount:0,

});
const [activities, setActivities] = useState([]);
useEffect(() => {

  const fetchDashboard = async () => {

    try {

      const res = await API.get("/admin/dashboard-stats");

      setStats(res.data);

    } catch (error) {

      console.log(error);

    }

  };
  const fetchActivities = async () => {

  try {

    const res = await API.get("/admin/recent-activities");

    setActivities(res.data);

  } catch (error) {

    console.log(error);

  }

};

  fetchDashboard();
  fetchActivities();
  const interval = setInterval(() => {

  fetchDashboard();

  fetchActivities();

}, 10000);
return () => clearInterval(interval);
}, []);
  return (
    <div className="admin-dashboard">

      {/* Welcome Section */}
<div className="dashboard-header">

  <div>

    <h1>👋 Welcome Back, Admin</h1>

    <p>
      Monitor workers, attendance, complaints and wages from one place.
    </p>

  </div>

  <div className="header-right">

    <div className="admin-profile">

      <div className="admin-avatar">
        👨‍💼
      </div>

      <div>

        <h4>Administrator</h4>

        <p>Online ●</p>

      </div>

    </div>


    <button
      className="add-worker-btn"
      onClick={() => navigate("/admin/register")}
    >
      👤 Register New User
    </button>

  </div>

</div>

      {/* Statistics Cards */}

      <div className="dashboard-cards">

       <div className="dashboard-card blue">

  <div>

    <h4>Total Workers</h4>

    <h2>{stats.totalWorkers}</h2>

    <p>

{stats.totalWorkers}

Active Workers

</p>

<span className="status-badge">

Live Data

</span>

<div className="progress">

<div

className="progress-fill"

style={{

width:"100%",

}}

></div>

</div>


  </div>

  <span>👷</span>

</div>

        <div className="dashboard-card green">
          <div>
            <h4>Attendance</h4>
           <h2>{stats.totalAttendance}</h2>
            <p>

{stats.attendancePercent}%

Today's Attendance

</p>

<div className="progress">

<div

className="progress-fill"

style={{

width:`${stats.attendancePercent}%`

}}

></div>

</div>
          </div>

          <span>📅</span>

        </div>

        <div className="dashboard-card orange">
          <div>
            <h4>Complaints</h4>
            <h2>{stats.totalComplaints}</h2>
            <p>

Resolved :

{stats.resolvedComplaints}

</p>

<div className="progress">

<div

className="progress-fill"

style={{

width:`${

stats.totalComplaints===0

?100

:

(stats.resolvedComplaints/

stats.totalComplaints)*100

}%`

}}

></div>

</div>
          </div>

          <span>⚠️</span>

        </div>

        <div className="dashboard-card purple">
          <div>
            <h4>Total Wages</h4>
            <h2>₹{stats.totalWages}</h2>
            <p>

Paid ₹

{stats.paidAmount}

</p>

<div className="progress">

<div

className="progress-fill"

style={{

width:`${

stats.totalWages===0

?100

:

(stats.paidAmount/

stats.totalWages)*100

}%`

}}

></div>

</div>
          </div>

          <span>💰</span>

        </div>

      </div>

      {/* Middle Section */}

      <div className="middle-section">

        {/* Recent Activities */}

        <div className="recent-activity">

          <h2>Recent Activities</h2>

        {
  activities.length === 0 ? (

    <div className="activity">

      <span>📭</span>

      <div>

        <h4>No Recent Activity</h4>

        <p>No new updates available.</p>

      </div>

    </div>

  ) : (

    activities.slice(0, 4).map((item, index) => (

      <div
        className="activity"
        key={index}
      >

        <span>{item.icon}</span>

        <div>

          <h4>{item.title}</h4>

          <p>{item.message}</p>

          <small>
            {new Date(item.time).toLocaleString("en-IN")}
          </small>

        </div>

      </div>

    ))

  )
}

        </div>

        {/* Quick Actions */}

        <div className="quick-actions">

          <h2>Quick Actions</h2>

          <button onClick={() => navigate("/admin/register")}>
  👤 Register New User
</button>

          <button onClick={() => navigate("/admin/workers")}>
  👷 Manage Workers
</button>

<button onClick={() => navigate("/admin/attendance")}>
  View Attendance
</button>

<button onClick={() => navigate("/admin/wages")}>
  Manage Wages
</button>

<button onClick={() => navigate("/admin/complaints")}>
  View Complaints
</button>

        </div>

      </div>

  {/* Analytics */}

<div className="analytics">

  <h2>Analytics Overview</h2>

  <div className="chart-container">

    <ResponsiveContainer width="55%" height={320}>

      <BarChart
        data={[
          {
            name: "Workers",
            value: stats.totalWorkers,
          },
          {
            name: "Attendance",
            value: stats.totalAttendance,
          },
          {
            name: "Complaints",
            value: stats.totalComplaints,
          },
          {
            name: "Wages",
            value:stats.wageRecords,
          },
        ]}
      >

        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="#2563eb"
          radius={[8,8,0,0]}
        />

      </BarChart>

    </ResponsiveContainer>

    <ResponsiveContainer width="40%" height={320}>

      <PieChart>

        <Pie
          data={[
            {
              name: "Workers",
              value: stats.totalWorkers,
            },
            {
              name: "Attendance",
              value: stats.totalAttendance,
            },
            {
              name: "Complaints",
              value: stats.totalComplaints,
            },
            {
              name: "Wages",
              value:stats.wageRecords,
            },
          ]}
          dataKey="value"
          outerRadius={95}
          label
        >

          <Cell fill="#2563eb" />
          <Cell fill="#16a34a" />
          <Cell fill="#f97316" />
          <Cell fill="#9333ea" />

        </Pie>

        <Tooltip />

        <Legend />

      </PieChart>

    </ResponsiveContainer>

  </div>

</div>

</div>



  );
}

export default AdminDashboard;