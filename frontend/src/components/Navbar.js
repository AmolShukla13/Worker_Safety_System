import "../styles/Navbar.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [alertCount, setAlertCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
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
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data);
        const unread = res.data.filter((item) => !item.isRead).length;
        setAlertCount(unread);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleProfileUpdate = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      const updatedNotifications = notifications.filter(
        (item) => item._id !== id
      );
      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter(
        (item) => !item.isRead
      ).length;
      setAlertCount(unread);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="navbar">
      <button 
        className="sidebar-toggle-btn"
        onClick={() => document.body.classList.toggle("sidebar-active")}
      >
        ☰
      </button>
      <div className="navbar-title">
        <h2>Worker Safety System</h2>
      </div>

      <div className="navbar-right">
        <div className="notification-wrapper" ref={notificationRef} style={{ position: "relative" }}>
          <div
            className="notification"
            onClick={async () => {
              setShowNotifications(!showNotifications);
              try {
                await API.put("/notifications/read");
                setAlertCount(0);
                setNotifications(
                  notifications.map((item) => ({
                    ...item,
                    isRead: true,
                  }))
                );
              } catch (error) {
                console.log(error);
              }
            }}
          >
            🔔
            {alertCount > 0 && <span className="badge">{alertCount}</span>}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>
              {notifications.length === 0 ? (
                <p>No Notifications</p>
              ) : (
                notifications.map((item) => (
                  <div className="notification-item" key={item._id}>
                    <div className="notification-top">
                      <h5>{item.title}</h5>
                      <button
                        className="delete-notification"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(item._id);
                        }}
                      >
                        🗑
                      </button>
                    </div>
                    <p>{item.message}</p>
                    <small>
                      {new Date(item.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="profile-wrapper" ref={profileRef} style={{ position: "relative" }}>
          <div
            className="profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="avatar">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="navbar-avatar-image"
                />
              ) : (
                "👷"
              )}
            </div>

            <div className="profile-info">
              <h4>{user ? user.name : "Loading..."}</h4>
              <p>{user ? user.role : "Worker"}</p>
            </div>

            <span className="arrow">⌄</span>
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div
                className="profile-option"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/profile");
                }}
              >
                👤 My Profile
              </div>

              <div
                className="profile-option"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/change-password");
                }}
              >
                🔑 Change Password
              </div>

              <div
                className="profile-option"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/settings");
                }}
              >
                ⚙ Settings
              </div>

              <div
                className="profile-option"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/logout");
                }}
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

export default Navbar;