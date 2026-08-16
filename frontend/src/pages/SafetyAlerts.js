import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/SafetyAlerts.css";

function SafetyAlerts() {

  const [alerts, setAlerts] = useState([]);

  // Fetch Alerts
  const fetchAlerts = async () => {

    try {

      const res = await API.get("/alerts");

      setAlerts(res.data);

    } catch (error) {

      console.log(error);

      alert("Unable to Load Alerts");

    }

  };

  useEffect(() => {

    fetchAlerts();

  }, []);

  return (

    <div className="safety-alerts-page">

      <h1>🛡 Safety Alerts</h1>

      {alerts.length === 0 ? (

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            fontSize: "18px",
            color: "#6b7280",
          }}
        >
          No Safety Alerts Available
        </div>

      ) : (

        alerts.map((item) => (

          <div
            className="alert-card"
            key={item._id}
          >

            <h3>{item.title}</h3>

            <p>{item.message}</p>

            <span
              className={`priority ${item.priority.toLowerCase()}`}
            >
              {item.priority}
            </span>

            <br />

            <small>

              {new Date(
                item.createdAt
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}

            </small>

          </div>

        ))

      )}

    </div>

  );

}

export default SafetyAlerts;