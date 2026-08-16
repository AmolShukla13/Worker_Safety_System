import "../styles/Attendance.css";
import { useState, useEffect } from "react";
import API from "../services/api";

function Attendance() {
  const [checkIn, setCheckIn] = useState("--:--");
  const [checkOut, setCheckOut] = useState("--:--");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const res = await API.get("/attendance/myattendance");

      setHistory(res.data);

      if (res.data.length > 0) {
        setCheckIn(res.data[0].checkIn || "--:--");
        setCheckOut(res.data[0].checkOut || "--:--");
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await API.post("/attendance/checkin");

      alert(res.data.message);

      loadAttendance();

    } catch (err) {
      alert(err.response?.data?.message || "Check In Failed");
    }
  };
const handleCheckOut = async () => {
  try {

    const res = await API.put("/attendance/checkout");

    alert(res.data.message);

    loadAttendance();

  } catch (err) {

    alert(err.response?.data?.message || "Check Out Failed");

  }
};

  return (
    <div className="attendance-page">

      <div className="attendance-header">
        <h1>Attendance Management</h1>
        <p>Track your attendance and work hours.</p>
      </div>

      <div className="attendance-cards">

        <div className="att-card">
          <h3>Check In</h3>

          <h1>{checkIn}</h1>

          <button
            className="attendance-btn"
            onClick={handleCheckIn}
          >
            Check In
          </button>
        </div>

        <div className="att-card">
          <h3>Check Out</h3>

          <h1>{checkOut}</h1>

          <button
            className="attendance-btn logout"
            onClick={handleCheckOut}
          >
            Check Out
          </button>
        </div>

      </div>

      <div className="attendance-table">

        <h2>Attendance History</h2>

        <table>

          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {history.length === 0 ? (
              <tr>
                <td colSpan="4">
                  No Attendance Found
                </td>
              </tr>
            ) : (

              history.map((item) => (

                <tr key={item._id}>

                  <td>
                    {new Date(item.date).toLocaleDateString()}
                  </td>

                  <td>
                    {item.checkIn || "--"}
                  </td>

                  <td>
                    {item.checkOut || "--"}
                  </td>

                  <td
                    className={
                      item.status === "Present"
                        ? "present"
                        : "absent"
                    }
                  >
                    {item.status}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Attendance;