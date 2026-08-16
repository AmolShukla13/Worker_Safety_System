import "../styles/Complaints.css";
import { useState, useEffect } from "react";
import API from "../services/api";

function Complaints() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/complaints", {
        title,
        description,
      });

      alert(res.data.message);

      setTitle("");
      setDescription("");

      loadComplaints();

    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending"
  ).length;
  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  return (
    <div className="complaints-page">

      <div className="complaints-header">
        <h1>Complaint Management</h1>
        <p>Report workplace issues and track complaint status.</p>
      </div>

      {/* Complaint Cards */}

      <div className="complaint-cards">

        <div className="complaint-card">
          <h3>Total Complaints</h3>
          <h1>{totalComplaints}</h1>
        </div>

        <div className="complaint-card pending">
          <h3>Pending</h3>
          <h1>{pendingComplaints}</h1>
        </div>

        <div className="complaint-card resolved-card">
          <h3>Resolved</h3>
          <h1>{resolvedComplaints}</h1>
        </div>

      </div>

      {/* Raise Complaint */}

      <div className="complaint-form">

        <h2>Raise Complaint</h2>

        <input
          type="text"
          placeholder="Complaint Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          rows="5"
          placeholder="Describe your issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button onClick={handleSubmit}>
          Submit Complaint
        </button>

      </div>

      {/* Complaint History */}

      <div className="complaint-history">

        <h2>Complaint History</h2>

        <table>

          <thead>

            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {complaints.length === 0 ? (

              <tr>
                <td colSpan="5">
                  No Complaints Found
                </td>
              </tr>

            ) : (

              complaints.map((item, index) => (

                <tr key={item._id}>

                  <td>{index + 1}</td>

                  <td>{item.title}</td>

                  <td>{item.description}</td>

                  <td>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  <td
                    className={
                      item.status === "Resolved"
                        ? "resolved"
                        : "open"
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

export default Complaints;