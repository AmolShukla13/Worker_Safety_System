import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await API.post("/auth/signup", form);
      alert(res.data.message || "Account Registered Successfully!");
      navigate("/admin/workers");
    } catch (err) {
      alert(
        err.response?.data?.message || "Registration Failed!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleRegister}>
        <h1>Register New User</h1>
        <p className="subtitle">
          Admin Portal - Create Worker or Admin Account
        </p>

        <div className="role-select-group">
          <label className="role-label">
            Select Account Role:
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="role-select"
          >
            <option value="worker">Worker</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register User"}
        </button>
      </form>

      {/* Industrial Safety AI Skyline Background */}
      <div className="industrial-skyline-container">
        <svg className="industrial-skyline-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <g opacity="0.12">
            <circle cx="200" cy="180" r="40" fill="none" stroke="var(--color-primary)" stroke-width="6" stroke-dasharray="10 6" />
            <circle cx="200" cy="180" r="25" fill="none" stroke="var(--color-primary)" stroke-width="2" />
            <circle cx="1000" cy="170" r="30" fill="none" stroke="var(--color-primary)" stroke-width="4" stroke-dasharray="8 4" />
            <path d="M 0,200 L 0,160 L 60,160 L 80,130 L 140,130 L 160,160 L 220,160 L 220,200 Z" fill="var(--color-primary-dark)" />
            <path d="M 280,200 L 280,120 L 330,80 L 380,120 L 450,120 L 450,200 Z" fill="var(--color-primary-dark)" />
            <path d="M 720,200 L 720,140 L 770,110 L 840,110 L 840,200 Z" fill="var(--color-primary-dark)" />
          </g>
          <g opacity="0.22">
            <path d="M 520,200 L 535,70 L 550,70 L 565,200 Z" fill="var(--color-primary-dark)" />
            <path d="M 570,200 L 580,90 L 592,90 L 602,200 Z" fill="var(--color-primary-dark)" />
            <circle className="safety-blinker-red" cx="542" cy="70" r="3.5" fill="var(--color-danger)" />
            <circle className="safety-blinker-amber" cx="586" cy="90" r="3" fill="var(--color-accent)" />
            <path d="M 120,200 L 126,200 L 126,60 L 70,40 L 70,36 L 220,36 L 126,60 Z" fill="none" stroke="var(--color-primary)" stroke-width="2" />
            <circle className="safety-blinker-red" cx="126" cy="36" r="3.5" fill="var(--color-danger)" />
            <line x1="190" y1="36" x2="190" y2="100" stroke="var(--color-primary-soft)" stroke-width="1.5" />
            <rect x="182" y="100" width="16" height="12" fill="var(--color-primary-dark)" stroke="var(--color-primary)" stroke-width="1" />
          </g>
          <g opacity="0.32">
            <path d="M 850,200 L 850,150 Q 950,60 1050,150 L 1050,200 Z" fill="var(--color-primary-dark)" />
            <rect x="880" y="165" width="12" height="20" rx="2" fill="var(--color-primary)" />
            <rect x="900" y="165" width="12" height="20" rx="2" fill="var(--color-primary)" />
            <rect x="920" y="165" width="12" height="20" rx="2" fill="var(--color-primary)" />
            <rect x="980" y="165" width="12" height="20" rx="2" fill="var(--color-accent)" />
            <rect x="1000" y="165" width="12" height="20" rx="2" fill="var(--color-accent)" />
            <rect x="1020" y="165" width="12" height="20" rx="2" fill="var(--color-primary)" />
            <path d="M 680,200 L 686,200 L 686,80 L 630,55 L 630,50 L 800,50 L 686,80 Z" fill="none" stroke="var(--color-primary)" stroke-width="2" />
            <circle className="safety-blinker-amber" cx="686" cy="50" r="3.5" fill="var(--color-accent)" />
            <line x1="770" y1="50" x2="770" y2="120" stroke="var(--color-primary-soft)" stroke-width="1.5" />
            <path d="M 1120,80 L 1150,65 L 1180,80 L 1180,120 Q 1150,150 1120,120 Z" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-dasharray="4 2" />
            <path d="M 1130,90 L 1150,78 L 1170,90 L 1170,115 Q 1150,135 1130,115 Z" fill="var(--color-primary-soft)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Register;