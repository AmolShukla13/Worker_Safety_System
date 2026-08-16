import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/AdminWages.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminWages() {

  const [wages, setWages] = useState([]);
  const [workers, setWorkers] = useState([]);

const [form, setForm] = useState({
  worker: "",
  month: "",
  amount: "",
  overtime: 0,
  status: "Pending",
});
const [editingId, setEditingId] = useState(null);
const [search, setSearch] = useState("");
const [monthFilter, setMonthFilter] = useState("");

const [editMonth, setEditMonth] = useState("");

const [editAmount, setEditAmount] = useState("");

const [editOvertime, setEditOvertime] = useState("");

const [editStatus, setEditStatus] = useState("Pending");

  const fetchWages = async () => {
    try {

      const res = await API.get("/admin/wages");

      setWages(res.data);

    } catch (err) {

      console.log(err);

      alert("Unable to load wages");

    }
  };

  const fetchWorkers = async () => {

  try {

    const res = await API.get("/admin/workers-list");

    setWorkers(res.data);

  } catch (error) {

    console.log(error);

  }

};
const addWage = async () => {

  try {

    await API.post("/admin/wages", form);

    alert("Wage Added Successfully");

    setForm({
      worker: "",
      month: "",
      amount: "",
      overtime: 0,
      status: "Pending",
    });

    fetchWages();

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Unable to Add Wage"
    );

  }

};
const updateWage = async () => {

  try {

    await API.put(`/admin/wages/${editingId}`, {
      month: editMonth,
      amount: editAmount,
      overtime: editOvertime,
      status: editStatus,
    });

    alert("Wage Updated Successfully");

    setEditingId(null);

    fetchWages();

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Unable to Update Wage"
    );

  }

};
const deleteWage = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this wage record?"
  );

  if (!confirmDelete) return;

  try {

    await API.delete(`/admin/wages/${id}`);

    alert("Wage Deleted Successfully");

    fetchWages();

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Unable to Delete Wage"
    );

  }

};
const generatePDF = () => {

  const doc = new jsPDF();

  // Heading
  doc.setFontSize(20);
  doc.text("Worker Safety Management System", 14, 20);

  doc.setFontSize(16);
  doc.text("Salary Report", 14, 30);

  // Date
  doc.setFontSize(11);
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    14,
    40
  );

  autoTable(doc, {
    startY: 50,

    head: [[
      "Worker",
      "Month",
      "Amount",
      "Status"
    ]],

    body: wages.map((item) => [

      item.worker?.name,

      item.month,

      "Rs. " + item.amount,

      item.status,

    ]),

    theme: "grid",

    headStyles: {
      fillColor: [37, 99, 235],
    },

  });

  doc.save("Salary_Report.pdf");

};
  useEffect(() => {
    fetchWages();
    fetchWorkers();
  }, []);

  return (

    <div className="admin-wages">
<div className="wages-header">

    <h1>💰 Wage Management</h1>

    <button
        className="pdf-btn"
        onClick={generatePDF}
    >
        📄 Download Report
    </button>

</div>
<div className="search-box">

  <input
    type="text"
    placeholder="🔍 Search Worker..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={monthFilter}
    onChange={(e) => setMonthFilter(e.target.value)}
  >
    <option value="">All Months</option>

    <option value="January">January</option>
    <option value="February">February</option>
    <option value="March">March</option>
    <option value="April">April</option>
    <option value="May">May</option>
    <option value="June">June</option>
    <option value="July">July</option>
    <option value="August">August</option>
    <option value="September">September</option>
    <option value="October">October</option>
    <option value="November">November</option>
    <option value="December">December</option>

  </select>

</div>

   <div className="worker-form">

<h2 className="form-title">
    📋 Add New Wage
</h2>

<div className="form-grid">

<div>

<label>Select Worker</label>

<select
value={form.worker}
onChange={(e)=>setForm({...form,worker:e.target.value})}
>
<option value="">Select Worker</option>

{workers.map(worker=>(
<option
key={worker._id}
value={worker._id}
>
{worker.name}
</option>
))}

</select>

</div>

<div>

<label>Month</label>

<input
type="text"
placeholder="Example : June"
value={form.month}
onChange={(e)=>setForm({...form,month:e.target.value})}
/>

</div>

<div>

<label>Salary Amount</label>

<input
type="number"
placeholder="Enter Salary"
value={form.amount}
onChange={(e)=>setForm({...form,amount:e.target.value})}
/>

</div>

<div>

<label>Overtime</label>

<input
type="number"
value={form.overtime}
onChange={(e)=>setForm({...form,overtime:e.target.value})}
/>

</div>

<div>

<label>Status</label>

<select
value={form.status}
onChange={(e)=>setForm({...form,status:e.target.value})}
>

<option value="Pending">
Pending
</option>

<option value="Paid">
Paid
</option>

</select>

</div>

</div>

<button
className="add-wage-btn"
onClick={addWage}
>
➕ Add Wage
</button>

</div>
{editingId && (

<div className="worker-form">

  <h3>✏️ Edit Wage</h3>

  <input
    type="text"
    placeholder="Month"
    value={editMonth}
    onChange={(e)=>setEditMonth(e.target.value)}
  />

  <br /><br />

  <input
    type="number"
    placeholder="Amount"
    value={editAmount}
    onChange={(e)=>setEditAmount(e.target.value)}
  />

  <br /><br />

  <input
    type="number"
    placeholder="Overtime"
    value={editOvertime}
    onChange={(e)=>setEditOvertime(e.target.value)}
  />

  <br /><br />

  <select
    value={editStatus}
    onChange={(e)=>setEditStatus(e.target.value)}
  >
    <option value="Pending">Pending</option>
    <option value="Paid">Paid</option>
  </select>

  <br /><br />

  <button onClick={updateWage}>
    💾 Update Wage
  </button>

  <button
    onClick={() => setEditingId(null)}
    style={{ marginLeft: "10px" }}
  >
    Cancel
  </button>

</div>

)}

      <table className="wages-table">

        <thead>

          <tr>

            <th>Worker</th>
            <th>Amount</th>
            <th>Month</th>
            <th>Status</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {wages.length === 0 ? (

            <tr>

              <td colSpan="4" style={{ textAlign: "center" }}>
                No Wage Records Found
              </td>

            </tr>

          ) : (

wages
.filter((item) => {

  const matchSearch =
    item.worker?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

 const matchMonth =
  monthFilter === "" ||
  item.month?.toLowerCase().trim() ===
  monthFilter.toLowerCase().trim();

  return matchSearch && matchMonth;

})
.map((item) => (

              <tr key={item._id}>

                <td>{item.worker?.name}</td>

                <td>₹{item.amount}</td>

                <td>{item.month}</td>

                <td>
  <span
    className={
      item.status === "Paid"
        ? "status paid"
        : "status pending"
    }
  >
    {item.status}
  </span>
</td>
                <td className="action-buttons">

  <button
  className="edit-btn"
    onClick={() => {

      setEditingId(item._id);

      setEditMonth(item.month);

      setEditAmount(item.amount);

      setEditOvertime(item.overtime);

      setEditStatus(item.status);

    }}
  >
    ✏️ 
  </button>
   <button
    className="delete-btn"
    onClick={() => deleteWage(item._id)}
  >
    🗑 
  </button>

</td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}


export default AdminWages;