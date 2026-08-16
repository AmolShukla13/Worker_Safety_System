import "../styles/Logout.css";
import { useNavigate } from "react-router-dom";

function Logout() {

  const navigate = useNavigate();

  const handleLogout = () => {

    // Remove Login Data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged out Successfully!");

    navigate("/login");

  };

  return (
    <div className="logout-page">

      <div className="logout-card">

        <div className="logout-icon">
          🚪
        </div>

        <h1>Logout</h1>

        <p>
          Are you sure you want to logout from Worker Safety System?
        </p>

        <div className="logout-buttons">

          <button
            className="cancel-btn"
            onClick={() => navigate("/worker-dashboard")}
          >
            Cancel
          </button>

          <button
            className="logout-btn-main"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Logout;