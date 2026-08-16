import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/AdminProfile.css";

function AdminProfile() {

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
});
const [showPasswordForm, setShowPasswordForm] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
const [preview, setPreview] = useState("");

const [passwordForm, setPasswordForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
useEffect(() => {

  const fetchProfile = async () => {

    try {

      const res = await API.get("/admin/profile");

      setProfile(res.data);
      setForm({
  name: res.data.admin.name,
  email: res.data.admin.email,
  phone: res.data.admin.phone || "",
});
setPreview(res.data.admin.profileImage || "");

    } catch (error) {

      console.log(error);

    }

  };

  fetchProfile();

}, []);
const updateProfile = async () => {
  try {
    let updatedForm = { ...form };

    // 1. Agar nayi image select ki hai, toh pehle upload karein
    if (selectedImage) {
      const formData = new FormData();
      formData.append("profileImage", selectedImage);

      const uploadRes = await API.put("/admin/profile/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Backend se jo URL mile, use form mein set karein
      updatedForm.profileImage = uploadRes.data.profileImage;
      setPreview(uploadRes.data.profileImage);
    } else {
      // IMPORTANT: Agar image change nahi ki, toh purani wali image ka URL bhejna hoga
      // Warna backend use overwrite karke empty kar dega
      updatedForm.profileImage = profile?.admin?.profileImage || "";
    }

    // 2. Ab profile ki baaki details (name, email, phone) aur updated image URL update karein
   const res = await API.put("/admin/profile", updatedForm);

setProfile({
  ...profile,
  admin: res.data.admin,
});

setPreview(res.data.admin.profileImage);

localStorage.setItem(
  "user",
  JSON.stringify(res.data.admin)
);
window.dispatchEvent(new Event("profileUpdated"));

alert("Profile Updated Successfully!");
    
    // Refresh ke baad bhi image dikhe isliye localStorage update karein
    localStorage.setItem("user", JSON.stringify(res.data.admin));

    setIsEditing(false);
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Unable to Update Profile");
  }
};
const changePassword = async () => {

  if (
    passwordForm.newPassword !==
    passwordForm.confirmPassword
  ) {
    return alert("New Password and Confirm Password do not match");
  }

  try {

    const res = await API.put(
      "/admin/change-password",
      {
        currentPassword:
          passwordForm.currentPassword,
        newPassword:
          passwordForm.newPassword,
      }
    );

    alert(res.data.message);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordForm(false);

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Unable to Change Password"
    );

  }

};
  return (

    <div className="admin-profile-page">

<div className="profile-top-card">

  <div className="profile-left">

    <div className="profile-avatar-big">

  {preview ? (

    <img
      src={preview}
      alt="Profile"
      className="profile-image"
    />

  ) : (

    "👨‍💼"

  )}

</div>
    <div>

      <h1>{profile?.admin?.name}</h1>

      <p>{profile?.admin?.role}</p>

      <span className="online-status">
        🟢 Online
      </span>

    </div>

  </div>

  <div className="profile-actions">

    <button
      className="edit-header-btn"
      onClick={() => setIsEditing(true)}
    >
      ✏️ Edit Profile
    </button>

    <button
  className="password-btn"
  onClick={() => setShowPasswordForm(true)}
>
  🔒 Change Password
</button>
{showPasswordForm && (

<div className="password-form">

  <h3>🔒 Change Password</h3>

  <input
    type="password"
    placeholder="Current Password"
    value={passwordForm.currentPassword}
    onChange={(e)=>
      setPasswordForm({
        ...passwordForm,
        currentPassword:e.target.value
      })
    }
  />

  <input
    type="password"
    placeholder="New Password"
    value={passwordForm.newPassword}
    onChange={(e)=>
      setPasswordForm({
        ...passwordForm,
        newPassword:e.target.value
      })
    }
  />

  <input
    type="password"
    placeholder="Confirm Password"
    value={passwordForm.confirmPassword}
    onChange={(e)=>
      setPasswordForm({
        ...passwordForm,
        confirmPassword:e.target.value
      })
    }
  />

  <div className="password-buttons">

    <button
      className="profile-btn"
      onClick={changePassword}
    >
      💾 Save Password
    </button>

    <button
      className="cancel-btn"
      onClick={() =>
        setShowPasswordForm(false)
      }
    >
      Cancel
    </button>

  </div>

</div>

)}

  </div>

</div>

      <div className="profile-content">

        <div className="profile-details">

          <h2>
            Personal Information
          </h2>

          <div className="info-row">

            <span>Name:</span>

            <strong>{profile?.admin?.name}</strong>

          </div>

          <div className="info-row">

            <span>Email:</span>

            <strong>{profile?.admin?.email}</strong>

          </div>

          <div className="info-row">

            <span>Role:</span>

            <strong>{profile?.admin?.role}</strong>

          </div>

          <div className="info-row">

            <span>Phone:</span>

            <strong>{profile?.admin?.phone || "Not Available"}</strong>

          </div>

          <div className="info-row">

            <span>Joined:</span>

          <strong>
  {profile?.admin?.createdAt
    ? new Date(profile.admin.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not Available"}
</strong>

          </div>

        {!isEditing ? (

<button
  className="profile-btn"
  onClick={() => setIsEditing(true)}
>
  ✏️ Edit Profile
</button>

) : (

<div className="edit-form">

  <input
    type="text"
    placeholder="Name"
    value={form.name}
    onChange={(e)=>
      setForm({
        ...form,
        name:e.target.value
      })
    }
  />

  <input
    type="email"
    placeholder="Email"
    value={form.email}
    onChange={(e)=>
      setForm({
        ...form,
        email:e.target.value
      })
    }
  />

  <input
    type="text"
    placeholder="Phone Number"
    value={form.phone}
    onChange={(e)=>
      setForm({
        ...form,
        phone:e.target.value
      })
    }
  />

  <input
  type="file"
  accept="image/*"
  onChange={(e) => {

    setSelectedImage(e.target.files[0]);

    setPreview(
      URL.createObjectURL(e.target.files[0])
    );

  }}
/>

  <button
    className="profile-btn"
    onClick={updateProfile}
  >
    💾 Save Changes
  </button>

  <button
    className="cancel-btn"
    onClick={() => setIsEditing(false)}
  >
    Cancel
  </button>

</div>

)}

        </div>

        <div className="profile-stats">

          <div className="stat-card">

            <h3>👷 Workers:</h3>

            <span>{profile?.totalWorkers}</span>

          </div>

          <div className="stat-card">

            <h3>📅 Attendance:</h3>

            <span>{profile?.totalAttendance}</span>

          </div>

          <div className="stat-card">

            <h3>💰 Wages:</h3>

            <span>{profile?.totalWages}</span>

          </div>

          <div className="stat-card">

            <h3>⚠️ Complaints:</h3>

            <span>{profile?.totalComplaints}</span>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AdminProfile;