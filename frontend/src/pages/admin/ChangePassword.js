import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/ChangePassword.css";

function ChangePassword() {
     const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const changePassword = async () => {

    if (form.newPassword !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {

      const res = await API.put(
        "/admin/change-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }
      );

      alert(res.data.message);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to Change Password"
      );

    }

  };

  return (

    <div className="change-password-page">

      <div className="change-card">

        <h2>🔒 Change Password</h2>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={(e)=>
            setForm({
              ...form,
              currentPassword:e.target.value
            })
          }
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={form.newPassword}
          onChange={(e)=>
            setForm({
              ...form,
              newPassword:e.target.value
            })
          }
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e)=>
            setForm({
              ...form,
              confirmPassword:e.target.value
            })
          }
        />

        <button
  type="button"
  className="show-btn"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword
    ? "🙈 Hide Password"
    : "👁 Show Password"}
</button>

        <button onClick={changePassword}>
          💾 Save Password
        </button>

        <button
  className="back-btn"
  onClick={() => navigate("/admin/profile")}
>
  ⬅ Back to Profile
</button>

      </div>

    </div>

  );

}

export default ChangePassword;