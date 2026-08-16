import { useEffect, useState } from "react";
import "../../styles/AdminSettings.css";
import { useSettings } from "../../context/SettingsContext";
import { useNavigate } from "react-router-dom";

function AdminSettings() {
    const navigate = useNavigate();
    const {
  darkMode,
  toggleTheme,
  notificationEnabled,
  toggleNotification,
} = useSettings();


  return (

    <div className="admin-settings">

      <h1>⚙️ Account Settings</h1>

 <div className="setting-card">

  <h3>🔔 Notifications</h3>

  <label className="switch">

<input
  type="checkbox"
  checked={notificationEnabled}
  onChange={toggleNotification}
/>

    <span className="slider"></span>

  </label>

</div>

     <div className="setting-card">

  <h3>🌐 Language</h3>

  <select>

    <option>English</option>

    <option>Hindi</option>

  </select>

</div>

      <div
  className="setting-card"
  onClick={toggleTheme}
  style={{ cursor: "pointer" }}
>

  <h3>🎨 Theme</h3>

  <p>
    {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
  </p>

</div>

     <div
  className="setting-card"
  onClick={() => navigate("/admin/change-password")}
  style={{ cursor:"pointer" }}
>

  <h3>🔒 Security</h3>

  <p>Change Password</p>

</div>

    </div>

  );

}

export default AdminSettings;