import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { title: "Dashboard", path: "/worker-dashboard", icon: "📊" },
    { title: "My Profile", path: "/profile", icon: "👤" },
    { title: "Attendance", path: "/attendance", icon: "📅" },
    { title: "My Wages", path: "/wages", icon: "💰" },
    { title: "My Complaints", path: "/complaints", icon: "📝" },
    { title: "Safety Guidelines", path: "/safety-guidelines", icon: "📘" },
    { title: "Safety Alerts", path: "/safety-alerts", icon: "🛡" },
  ];

  const handleLinkClick = () => {
    document.body.classList.remove("sidebar-active");
  };

  return (
    <div className="sidebar">
      <div>
        <h2 className="logo">
          🛡 Safety
        </h2>

        <nav>
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={handleLinkClick}
            >
              <span className="menu-emoji-icon">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <Link to="/logout" onClick={handleLinkClick}>
          <span className="menu-emoji-icon">🚪</span>
          Logout
        </Link>

        <div className="safety-card">
          <h3>🛡️ Safety Status</h3>
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            <strong>ACTIVE SECURE</strong>
          </div>
          <p>⚡ Telemetry: Connected</p>
          <p>💯 Safety Score: 100%</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;