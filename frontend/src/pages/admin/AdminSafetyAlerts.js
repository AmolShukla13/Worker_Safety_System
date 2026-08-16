import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/AdminSafetyAlerts.css";

function AdminSafetyAlerts() {

  const [alerts, setAlerts] = useState([]);

  const [form, setForm] = useState({
    title: "",
    message: "",
    priority: "Low",
  });

  const fetchAlerts = async () => {

    try {

      const res = await API.get("/admin/alerts");

      setAlerts(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchAlerts();

  }, []);

  const addAlert = async () => {

    try {

      await API.post("/admin/alerts", form);

      alert("Alert Sent Successfully");

      setForm({
        title: "",
        message: "",
        priority: "Low",
      });

      fetchAlerts();

    } catch (error) {

      console.log(error);

      console.log(error.response);
console.log(error.response?.data);

    }

  };
  const deleteAlert = async (id) => {

  try {

    await API.delete(`/admin/alerts/${id}`);

    fetchAlerts();

    alert("Alert Deleted Successfully");

  } catch (error) {

    console.log(error);

    alert("Unable to Delete Alert");

  }

};

  return (

    <div className="admin-alerts">

      <h1>🛡 Safety Alerts</h1>

      <div className="alert-form">

        <input
          type="text"
          placeholder="Alert Title"
          value={form.title}
          onChange={(e)=>
            setForm({
              ...form,
              title:e.target.value
            })
          }
        />

        <textarea
          placeholder="Alert Message"
          value={form.message}
          onChange={(e)=>
            setForm({
              ...form,
              message:e.target.value
            })
          }
        />

        <select
          value={form.priority}
          onChange={(e)=>
            setForm({
              ...form,
              priority:e.target.value
            })
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          onClick={addAlert}
        >
          📢 Send Alert
        </button>
        <h2 style={{marginBottom:"20px"}}>
All Safety Alerts
</h2>

<table className="alerts-table">

<thead>

<tr>

<th>Title</th>

<th>Message</th>

<th>Priority</th>

<th>Date</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{alerts.map((item)=>(

<tr key={item._id}>

<td>{item.title}</td>

<td>{item.message}</td>

<td>{item.priority}</td>

<td>

{new Date(item.createdAt).toLocaleDateString()}

</td>

<td>

<button
className="delete-btn"
onClick={()=>deleteAlert(item._id)}
>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

      </div>

    </div>

  );

}

export default AdminSafetyAlerts;