import { useState, useEffect, useRef } from "react";
import "./AdminNavbar.css";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

function AdminNavbar() {

  const [showNotification, setShowNotification] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  
  const navigate = useNavigate();
  const { notificationEnabled } = useSettings();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/admin/profile");
        setUser(res.data.admin);
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.admin)
        );
      } catch (error) {
        console.log(error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/admin/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const updateProfile = () => {
      const latestUser = JSON.parse(
        localStorage.getItem("user")
      );
      setUser(latestUser);
    };

    window.addEventListener(
      "profileUpdated",
      updateProfile
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        updateProfile
      );
    };
  }, []);

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/admin/notifications/${id}`);
      setNotifications((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-navbar">
      <button 
        className="sidebar-toggle-btn"
        onClick={() => document.body.classList.toggle("sidebar-active")}
      >
        ☰
      </button>
      <div className="admin-title">
        <div className="title-box">
          <h2>🛡 Admin Panel</h2>
          <span>Worker Safety Management System</span>
        </div>
      </div>

      <div className="admin-right">
        <div className="notification-wrapper" ref={notificationRef}>
          <div
            className="notification"
            onClick={async () => {
              if (!notificationEnabled) {
                alert("Notifications are disabled from Settings.");
                return;
              }

              setShowNotification(!showNotification);

              if (!showNotification) {
                try {
                  await API.put("/admin/notifications/read");
                  setNotifications((prev) =>
                    prev.map((item) => ({
                      ...item,
                      isRead: true,
                    }))
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            }}
          >
            🔔
            <span className="badge">
              {notificationEnabled ? unreadCount : "🔕"}
            </span>
          </div>

          {showNotification && (
            <div className="notification-box">
              <h4>🔔 Notifications</h4>

              {notifications.length === 0 ? (
                <div className="notification-item">
                  No Notifications
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    className="notification-item"
                    key={item._id}
                  >
                    <div className="notification-content">
                      <strong>{item.title}</strong>
                      <br />
                      <small>{item.message}</small>
                    </div>

                    <button
                      className="delete-notification"
                      onClick={() => deleteNotification(item._id)}
                    >
                      🗑
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="profile-wrapper" ref={profileRef} style={{ position: "relative" }}>
          <div
            className="admin-profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Admin"
                  className="navbar-avatar-image"
                />
              ) : (
                "👨‍💼"
              )}
            </div>
            <div>
              <h4>{user?.name || "Admin"}</h4>
              <p>{user?.role || "Admin"}</p>
            </div>
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div
                className="profile-item"
                onClick={() => {
                  navigate("/admin/profile");
                  setShowProfileMenu(false);
                }}
              >
                👤 My Profile
              </div>

              <div
                className="profile-item"
                onClick={() => {
                  navigate("/admin/settings");
                  setShowProfileMenu(false);
                }}
              >
                ⚙️ Account Settings
              </div>

              <div
                className="profile-item"
                onClick={() => {
                  navigate("/admin/change-password");
                  setShowProfileMenu(false);
                }}
              >
                🔒 Change Password
              </div>

              <div
                className="profile-item"
                onClick={handleLogout}
              >
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;