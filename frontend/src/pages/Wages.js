import "../styles/Wages.css";
import { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
function Wages() {
  const [wages, setWages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadWages();
  }, []);

const loadWages = async () => {

  try {

    const [wageRes, profileRes] = await Promise.all([

      API.get("/wages/mywages"),

      API.get("/auth/profile"),

    ]);

    setWages(wageRes.data || []);

    setUser(profileRes.data);

  } catch (err) {

    console.log(err);

  }

};

  const latest = wages.length > 0 ? wages[0] : null;

  const downloadPayslip = () => {

  if (!latest) {

    alert("No Wage Record Found");

    return;

  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Worker Payslip", 14, 20);

  doc.setFontSize(11);
  doc.text(
    `Generated : ${new Date().toLocaleString()}`,
    14,
    30
  );

  autoTable(doc, {

    startY: 40,

    head: [["Field", "Details"]],

    body: [

      ["Worker Name", user?.name || "Worker"],

      ["Month", latest.month],

      ["Salary", `Rs. ${latest.amount}`],

      ["Overtime", `Rs. ${latest.overtime}`],

      [
        "Total",
        `Rs. ${latest.amount + latest.overtime}`,
      ],

      ["Status", latest.status],

    ],

    theme: "grid",

    headStyles: {

      fillColor: [37, 99, 235],

    },

  });

  doc.save(`Payslip-${latest.month}.pdf`);

};

  return (
    <div className="wages-page">

      <div className="wages-header">
        <h1>Wage Management</h1>
        <p>Track salary payments and earnings history.</p>
      </div>

      <div className="wage-cards">

        <div className="wage-card">
          <h3>Monthly Wage</h3>
          <h1>₹{latest ? latest.amount : 0}</h1>
        </div>

        <div className="wage-card">
          <h3>Overtime</h3>
          <h1>₹{latest ? latest.overtime : 0}</h1>
        </div>

        <div className="wage-card">
          <h3>Status</h3>
          <h1>{latest ? latest.status : "Pending"}</h1>
        </div>

        <div className="wage-card total">
          <h3>Total Earnings</h3>
          <h1>
            ₹
            {latest
              ? latest.amount + latest.overtime
              : 0}
          </h1>
        </div>

      </div>

      <div className="payment-history">

        <h2>Payment History</h2>

        <table>

          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Overtime</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {wages.length === 0 ? (
              <tr>
                <td colSpan="4">
                  No Wage Records Found
                </td>
              </tr>
            ) : (
              wages.map((item) => (
                <tr key={item._id}>
                  <td>{item.month}</td>

                  <td>₹{item.amount}</td>

                  <td>₹{item.overtime}</td>

                  <td
                    className={
                      item.status === "Paid"
                        ? "paid"
                        : "pending"
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

      <div className="download-section">

  <button
    className="download-btn"
    onClick={downloadPayslip}
  >
    📄 Download Payslip
  </button>

</div>

    </div>
  );
}

export default Wages;