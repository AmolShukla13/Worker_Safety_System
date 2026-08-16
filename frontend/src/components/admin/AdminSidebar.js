import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";
import { useEffect, useState } from "react";
import API from "../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


function AdminSidebar() {
  const location = useLocation();

  const [summary, setSummary] = useState({
  workers: 0,
  attendance: 0,
  complaints: 0,
  wages: 0,
});

  const menu = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      title: "Register User",
      path: "/admin/register",
      icon: "👤➕",
    },
    {
      title: "Workers",
      path: "/admin/workers",
      icon: "👷",
    },
    {
      title: "Attendance",
      path: "/admin/attendance",
      icon: "📅",
    },
    {
      title: "Complaints",
      path: "/admin/complaints",
      icon: "📝",
    },
    {
      title: "Wages",
      path: "/admin/wages",
      icon: "💰",
    },
    {
  title: "Safety Alerts",
  path: "/admin/alerts",
  icon: "🛡",
},
{
  title:"Safety Guidelines",
  path:"/admin/guidelines",
  icon:"📘",
},
   {
  title: "Logout",
  path: "/admin/logout",
  icon: "🚪",
},
  ];
  const downloadSystemReport = () => {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Worker Safety Management System", 14, 20);

  doc.setFontSize(14);
  doc.text("System Summary Report", 14, 32);

  doc.setFontSize(11);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    42
  );

  autoTable(doc, {
    startY: 50,
    head: [["Category", "Value"]],
    body: [
      ["Total Workers", summary.workers],
      ["Attendance Records", summary.attendance],
      ["Complaints", summary.complaints],
      [
  "Total Wages",
  `Rs. ${Number(summary.wages).toLocaleString("en-IN")}`,
],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  doc.save("System_Report.pdf");

};
  useEffect(() => {

  const fetchSummary = async () => {

    try {

      const res = await API.get("/admin/dashboard-stats");

      console.log(res.data);

      setSummary({
        workers: res.data.totalWorkers,
        attendance: res.data.totalAttendance,
        complaints: res.data.totalComplaints,
        wages: res.data.totalWages,
      });

    } catch (error) {

      console.log(error);

    }

  };

  fetchSummary();

}, []);

  return (
    <div className="admin-sidebar">

      <h2 className="logo">
        🛡 Admin
      </h2>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={
            location.pathname === item.path
              ? "menu active"
              : "menu"
          }
          onClick={() => document.body.classList.remove("sidebar-active")}
        >
          <span>{item.icon}</span>
          {item.title}
        </Link>
      ))}

            <div className="sidebar-footer">

        <div className="sidebar-card">

          <h3>📊 System Summary</h3>

         <p>👷 Workers : {summary.workers}</p>

<p>📅 Attendance : {summary.attendance}</p>

<p>📝 Complaints : {summary.complaints}</p>

<p>
  💰 Wages : Rs. {Number(summary.wages).toLocaleString("en-IN")}
</p>


          <h4>Building a Safer Tomorrow</h4>

          <button
  className="report-btn"
  onClick={downloadSystemReport}
>
  📄 Download Report
</button>

        </div>

      </div>

    </div>
  );
}

export default AdminSidebar;