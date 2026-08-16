import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/AdminAttendance.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const fetchAttendance = async () => {
  
    try {
      const res = await API.get("/admin/attendance");
      setAttendance(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load attendance");
    }
  };

  const generatePDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Worker Safety Management System", 14, 20);

  doc.setFontSize(15);
  doc.text("Attendance Report", 14, 32);

  doc.setFontSize(11);
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    14,
    42
  );

  autoTable(doc, {
    startY: 50,
    head: [["Worker", "Date", "Check In", "Check Out", "Status"]],
    body: attendance.map((item) => [
      item.worker?.name,
      new Date(item.date).toLocaleDateString(),
      item.checkIn || "--",
      item.checkOut || "--",
      item.status,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  doc.save("Attendance_Report.pdf");

};

  useEffect(() => {
    fetchAttendance();
  }, []);

  const totalAttendance = attendance.length;

const presentCount = attendance.filter(
  (item) => item.status === "Present"
).length;

const absentCount = attendance.filter(
  (item) => item.status === "Absent"
).length;

const lateCount = attendance.filter(
  (item) => item.status === "Late"
).length;

const pendingCount = attendance.filter(
  (item) => item.status === "Pending"
).length;
const attendancePercentage =
  totalAttendance === 0
    ? 0
    : Math.round((presentCount / totalAttendance) * 100);

  return (
    <div className="admin-attendance">

<div className="attendance-header">

  <h1>📅 Attendance Management</h1>

  <button
    className="pdf-btn"
    onClick={generatePDF}
  >
    📄 Download Report
  </button>

</div>

<div className="attendance-cards">

  <div className="attendance-card">
    <h3>👥 Total</h3>
    <span>{totalAttendance}</span>
  </div>

  <div className="attendance-card">
    <h3>🟢 Present</h3>
    <span>{presentCount}</span>
  </div>

  <div className="attendance-card">
    <h3>🔴 Absent</h3>
    <span>{absentCount}</span>
  </div>

  <div className="attendance-card">
    <h3>🟠 Late</h3>
<span>{lateCount}</span>
  </div>
  <div className="attendance-card">

  <h3>📈 Attendance</h3>

  <span>{attendancePercentage}%</span>

</div>

</div>
    <div className="attendance-toolbar">

  <div className="attendance-search">

    <input
      type="text"
      placeholder="🔍 Search Worker..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

  </div>

  <div className="attendance-filter">

    <input
      type="date"
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
    />

  </div>

</div>

      <table className="attendance-table">

        <thead>
          <tr>
            <th>Worker</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {attendance.length === 0 ? (

            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No Attendance Found
              </td>
            </tr>

          ) : (

           attendance
.filter((item) => {

  const matchSearch =
    item.worker?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchDate =
    dateFilter === "" ||
    new Date(item.date)
      .toISOString()
      .split("T")[0] === dateFilter;

  return matchSearch && matchDate;

})
.map((item) => (

              <tr key={item._id}>

                <td>{item.worker?.name}</td>

                <td>
                  {new Date(item.date).toLocaleDateString()}
                </td>

                <td>{item.checkIn || "--"}</td>

                <td>{item.checkOut || "--"}</td>

               <td>
  <span className={`status ${item.status?.toLowerCase()}`}>
    {item.status}
  </span>
</td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default AdminAttendance;