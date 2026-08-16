import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/AdminWorkers.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaEdit, FaTrash } from "react-icons/fa";


function AdminWorkers() {
  const [workers, setWorkers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

const [editName, setEditName] = useState("");

const [editEmail, setEditEmail] = useState("");

  const fetchWorkers = async () => {
    try {
      const res = await API.get("/admin/workers");
      setWorkers(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load workers");
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addWorker = async () => {
    try {
      await API.post("/admin/workers", form);

      alert("Worker Added Successfully");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      fetchWorkers();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const deleteWorker = async (id) => {
    if (!window.confirm("Delete this worker?")) return;

    try {
      await API.delete(`/admin/workers/${id}`);

      alert("Worker Deleted");

      fetchWorkers();

    } catch (err) {
      alert("Delete Failed");
    }
  };

  const downloadPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("Workers Report", 14, 20);

  autoTable(doc, {
    head: [["Name", "Email", "Role"]],
    body: workers.map((worker) => [
      worker.name,
      worker.email,
      worker.role,
    ]),
    startY: 30,
  });

  doc.save("Workers_Report.pdf");

};

  const updateWorker = async () => {

  try {

    await API.put(`/admin/workers/${editingId}`, {
      name: editName,
      email: editEmail,
    });

    alert("Worker Updated Successfully");

    setEditingId(null);

    fetchWorkers();

  } catch (err) {

    alert("Update Failed");

  }

};

  return (
     <div className="admin-workers">
      <div className="worker-header">
  <h1>👷 Workers Management</h1>
</div>

<div className="worker-stats">

  <div className="stat-card">
    <h3>👷 Total Workers</h3>
    <h2>{workers.length}</h2>
     <p>Total = {workers.length}</p>
    <p>Registered Workers</p>
  </div>

  <div className="stat-card green-card">
    <h3>🟢 Active Workers</h3>
    <h2>{workers.length}</h2>
    <p>Total = {workers.length}</p>
    <p>Currently Working</p>
  </div>

</div>
      <br />

<input
  className="search-box"
  type="text"
  placeholder="Search Worker..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
<br />
<br />

<div className="worker-form">
      <input
        name="name"
        placeholder="Worker Name"
        value={form.name}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <br /><br />

    <button className="add-btn" onClick={addWorker}>
  Add Worker
</button>

<button
  onClick={downloadPDF}
  style={{
    marginLeft: "10px",
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  }}
>
  📄 Download PDF
</button>

</div>

      <hr />

      {editingId && (

  <div>

    <h2>Edit Worker</h2>

    <input
      value={editName}
      onChange={(e) => setEditName(e.target.value)}
      placeholder="Worker Name"
    />

    <br />
    <br />

    <input
      value={editEmail}
      onChange={(e) => setEditEmail(e.target.value)}
      placeholder="Worker Email"
    />

    <br />
    <br />

    <button onClick={updateWorker}>
      Update Worker
    </button>

    <hr />

  </div>

)}

      <table className="worker-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {workers
 .filter((worker) => {
  const matchSearch =
    worker.name.toLowerCase().includes(search.toLowerCase()) ||
    worker.email.toLowerCase().includes(search.toLowerCase());

return matchSearch;
})
  .map((worker) => (

            <tr key={worker._id}>

              <td>{worker.name}</td>

              <td>{worker.email}</td>

              <td>{worker.role}</td>

             <td>
               <div className="action-buttons">
                 <button
                   className="edit-btn"
                   onClick={() => {
                     setEditingId(worker._id);
                     setEditName(worker.name);
                     setEditEmail(worker.email);
                   }}
                 >
                   <FaEdit /> Edit
                 </button>
                 <button
                   className="delete-btn"
                   onClick={() => deleteWorker(worker._id)}
                 >
                   <FaTrash /> Delete
                 </button>
               </div>
             </td>

            </tr>

          ))}

        </tbody>
      </table>

    </div>
  );
}

export default AdminWorkers;