import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/AdminComplaints.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminComplaints() {

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");

  const fetchComplaints = async () => {

    try {

     const res = await API.get("/admin/complaints");

      setComplaints(res.data);

    } catch (err) {

      console.log(err);

      alert("Unable to load complaints");

    }

  };

  const resolveComplaint = async (id) => {

  try {

    await API.put(`/admin/complaints/${id}`);

  setComplaints((prev) =>
  prev.map((item) => {

    if (item._id !== id) return item;

    if (item.status === "Pending") {
      return {
        ...item,
        status: "In Progress",
      };
    }

    return {
      ...item,
      status: "Resolved",
    };

  })
);

    alert("Complaint Resolved Successfully");

  } catch (error) {

    console.log(error);

    alert("Unable to Resolve Complaint");

  }

};

const deleteComplaint = async (id) => {

  if (!window.confirm("Delete this complaint?")) return;

  try {

    await API.delete(`/admin/complaints/${id}`);

    setComplaints((prev) =>
      prev.filter((item) => item._id !== id)
    );

    alert("Complaint Deleted Successfully");

  } catch (error) {

    console.log(error);

    alert("Unable to Delete Complaint");

  }

};

const generatePDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Worker Safety Management System", 14, 20);

  doc.setFontSize(15);
  doc.text("Complaint Report", 14, 32);

  doc.setFontSize(11);
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    14,
    42
  );

  autoTable(doc, {
    startY: 50,

    head: [[
      "Worker",
      "Title",
      "Description",
      "Status",
    ]],

    body: complaints.map((item) => [

      item.worker?.name,

      item.title,

      item.description,

      item.status,

    ]),

    theme: "grid",

    headStyles: {
      fillColor: [37, 99, 235],
    },

  });

  doc.save("Complaint_Report.pdf");

};

  useEffect(() => {
    fetchComplaints();
  }, []);

  const totalComplaints = complaints.length;

const pendingCount = complaints.filter(
  (item) => item.status === "Pending"
).length;

const resolvedCount = complaints.filter(
  (item) => item.status === "Resolved"
).length;

const progressCount = complaints.filter(
  (item) => item.status === "In Progress"
).length;

  return (

    <div className="admin-complaints">
      <h1>📝 Complaints Management</h1>

<div className="complaints-top">

  <div className="complaints-search">

    <input
      type="text"
      placeholder="🔍 Search Complaint..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

  </div>

  <button
    className="pdf-btn"
    onClick={generatePDF}
  >
    📄 Download Report
  </button>

</div>

<div className="complaints-header">
        <div className="complaints-cards">

  <div className="complaint-card">
    <h3>📝 Total</h3>
    <span>{totalComplaints}</span>
  </div>

  <div className="complaint-card">
    <h3>🟡 Pending</h3>
    <span>{pendingCount}</span>
  </div>

  <div className="complaint-card">
    <h3>🔵 In Progress</h3>
    <span>{progressCount}</span>
  </div>

  <div className="complaint-card">
    <h3>🟢 Resolved</h3>
    <span>{resolvedCount}</span>
  </div>

</div>

       

      </div>

      <table className="complaints-table">

        <thead>

         <tr>

  <th>Worker</th>

  <th>Title</th>

  <th>Description</th>

  <th>Status</th>

  <th>Action</th>

</tr>

        </thead>

   <tbody>

  {complaints.length === 0 ? (

    <tr>

      <td colSpan="5" style={{ textAlign: "center" }}>
        No Complaints Found
      </td>

    </tr>

  ) : (

complaints
  .filter((item) => {

    return (

      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.description
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.worker?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())

    );

  })
  .map((item) => (

      <tr key={item._id}>

        <td>{item.worker?.name}</td>

        <td>{item.title}</td>

        <td>{item.description}</td>

        <td>

          <span
            className={`status ${item.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {item.status}
          </span>

        </td>

 <td>

  <div className="action-buttons">

  {item.status !== "Resolved" && (

  <button
    className="resolve-btn"
    onClick={() => resolveComplaint(item._id)}
  >
    {item.status === "Pending"
      ? "🚧 Start Progress"
      : "✅ Resolve"}
  </button>

)}

    <button
      className="delete-btn"
      onClick={() => deleteComplaint(item._id)}
    >
      🗑 Delete
    </button>

  </div>

</td>

      </tr>

    ))

  )}

</tbody>

      </table>

    </div>

  );

}

export default AdminComplaints;