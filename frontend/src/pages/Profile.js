import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    emergencyContact: "",
    profileImage: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [stats, setStats] = useState({
    attendance: 0,
    wages: 0,
    complaints: 0,
  });

  const fetchProfileAndStats = useCallback(async () => {
    try {
      const [profileRes, attendanceRes, wagesRes, complaintsRes] = await Promise.all([
        API.get("/auth/profile"),
        API.get("/attendance/myattendance"),
        API.get("/wages/mywages"),
        API.get("/complaints"),
      ]);

      setUser(profileRes.data);
      setForm({
        name: profileRes.data.name || "",
        phone: profileRes.data.phone || "",
        address: profileRes.data.address || "",
        emergencyContact: profileRes.data.emergencyContact || "",
        profileImage: profileRes.data.profileImage || "",
      });
      setPreview(profileRes.data.profileImage || "");

      setStats({
        attendance: attendanceRes.data?.length || 0,
        wages: wagesRes.data?.length || 0,
        complaints: complaintsRes.data?.length || 0,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchProfileAndStats();
  }, [fetchProfileAndStats]);

  const uploadProfileImage = async (file) => {
    if (!file) return null;
    try {
      const data = new FormData();
      data.append("image", file);

      const res = await API.post("/auth/upload-profile-image", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.image;
    } catch (error) {
      console.log("Image Upload Failed:", error);
      alert("Image Upload Failed");
      return null;
    }
  };

  const updateProfile = async () => {
    try {
      let updatedForm = { ...form };

      if (selectedImage) {
        const uploadedImageUrl = await uploadProfileImage(selectedImage);
        if (uploadedImageUrl) {
          updatedForm.profileImage = uploadedImageUrl;
        }
      }

      const res = await API.put("/auth/profile", updatedForm);
      setUser(res.data.user);
      setPreview(res.data.user.profileImage || "");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("profileUpdated"));

      alert("Profile Updated Successfully!");
      setIsEditing(false);
      setSelectedImage(null);
    } catch (error) {
      console.error(error);
      alert("Unable to Update Profile");
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return alert("New Password and Confirm Password do not match");
    }

    try {
      const res = await API.put("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      alert(res.data.message);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to Change Password");
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-top-card">
        <div className="profile-left">
          <div className="profile-avatar-big">
            {preview ? (
              <img src={preview} alt="Profile" className="profile-image" />
            ) : (
              "👷"
            )}
          </div>
          <div>
            <h1>{user.name}</h1>
            <p>{user.role}</p>
            <span className="online-status">🟢 Online</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-header-btn" onClick={() => setIsEditing(true)}>
            ✏️ Edit Profile
          </button>
          <button className="password-btn" onClick={() => setShowPasswordForm(true)}>
            🔒 Change Password
          </button>

          {showPasswordForm && (
            <div className="password-form">
              <h3>🔒 Change Password</h3>
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
              />
              <div className="password-buttons">
                <button className="profile-btn" onClick={changePassword}>
                  💾 Save Password
                </button>
                <button className="cancel-btn" onClick={() => setShowPasswordForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-details">
          <h2>Personal Information</h2>

          <div className="info-row">
            <span>Name:</span>
            <strong>{user.name}</strong>
          </div>

          <div className="info-row">
            <span>Email:</span>
            <strong>{user.email}</strong>
          </div>

          <div className="info-row">
            <span>Role:</span>
            <strong>{user.role}</strong>
          </div>

          <div className="info-row">
            <span>Phone:</span>
            <strong>{user.phone || "Not Added"}</strong>
          </div>

          <div className="info-row">
            <span>Address:</span>
            <strong>{user.address || "Not Added"}</strong>
          </div>

          <div className="info-row">
            <span>Emergency Contact:</span>
            <strong>{user.emergencyContact || "Not Added"}</strong>
          </div>

          <div className="info-row">
            <span>Joined:</span>
            <strong>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Not Available"}
            </strong>
          </div>

          <div className="info-row">
            <span>User ID:</span>
            <strong>{user._id}</strong>
          </div>

          {!isEditing ? (
            <button className="profile-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-form">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <input
                type="text"
                placeholder="Emergency Contact"
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setSelectedImage(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
              <button className="profile-btn" onClick={updateProfile}>
                💾 Save Changes
              </button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>📅 Attendance Logs:</h3>
            <span>{stats.attendance}</span>
          </div>

          <div className="stat-card">
            <h3>💰 Wages Logs:</h3>
            <span>{stats.wages}</span>
          </div>

          <div className="stat-card">
            <h3>⚠️ My Complaints:</h3>
            <span>{stats.complaints}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;