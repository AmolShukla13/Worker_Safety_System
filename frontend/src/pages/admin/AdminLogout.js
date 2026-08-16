import { useNavigate } from "react-router-dom";
import "../../styles/AdminLogout.css";

function AdminLogout() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div className="admin-logout-page">

      <div className="logout-card">

        <div className="logout-icon">
          🛡
        </div>

        <h1>Admin Logout</h1>

        <p>
          Are you sure you want to logout from
          <br />
          Admin Panel?
        </p>

        <div className="logout-buttons">

          <button
            className="cancel-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            Cancel
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  );

}

export default AdminLogout;