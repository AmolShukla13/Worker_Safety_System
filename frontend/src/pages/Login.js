import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaPhoneAlt, FaThumbsUp, FaUserShield, FaHardHat } from "react-icons/fa";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Admin"); // Default Admin role, toggle between "Admin" & "worker"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'emergency', 'safety', or null
  const [adminPhone, setAdminPhone] = useState("9026063381");

  useEffect(() => {
    const fetchAdminPhone = async () => {
      try {
        const res = await API.get("/auth/admin-phone");
        if (res.data && res.data.phone) {
          setAdminPhone(res.data.phone);
        }
      } catch (err) {
        console.log("Admin phone fetch failed:", err);
      }
    };
    fetchAdminPhone();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password, role });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/worker-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-header">
          <h1><span className="red-text">Worker</span> Safety <span className="red-text">System</span></h1>
          <p>ENSURE YOUR SAFETY, EVERY DAY!</p>
        </div>

        <div className="login-box-wrapper">
          <form className="login-box" onSubmit={handleSubmit}>
            <h2>Login to Your Account</h2>

            <div className="role-selector">
              <button
                type="button"
                className={`role-btn left ${role === "Admin" ? "active" : ""}`}
                onClick={() => setRole("Admin")}
              >
                <FaUserShield /> ADMIN
              </button>
              <button
                type="button"
                className={`role-btn right ${role === "worker" ? "active" : ""}`}
                onClick={() => setRole("worker")}
              >
                <FaHardHat /> WORKER
              </button>
            </div>

            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="email"
                placeholder="Username (Email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" /> Remember Me
              </label>
              <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Please Wait..." : `LOGIN AS ${role.toUpperCase()}`}
            </button>

            <div className="login-footer">
              <div className="footer-link" onClick={() => setModalType("emergency")}>
                <FaPhoneAlt /> Emergency Contact
              </div>
              <div className="footer-link" onClick={() => setModalType("safety")}>
                <FaThumbsUp /> Safety Tips
              </div>
            </div>
          </form>
        </div>
      </div>

      {modalType === "emergency" && (
        <div className="login-modal-overlay" onClick={() => setModalType(null)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🚨 Emergency Helpline Numbers</h3>
            <div className="modal-item">
              <strong>👷 Admin Control Room:</strong> <span>{adminPhone}</span>
            </div>
            <div className="modal-item">
              <strong>🚓 Police SOS:</strong> <span>112 / 100</span>
            </div>
            <div className="modal-item">
              <strong>🚒 Fire Brigade:</strong> <span>101</span>
            </div>
            <div className="modal-item">
              <strong>🚑 Ambulance (Medical):</strong> <span>102 / 108</span>
            </div>
            <button className="modal-close-btn" onClick={() => setModalType(null)}>Close</button>
          </div>
        </div>
      )}

      {modalType === "safety" && (
        <div className="login-modal-overlay" onClick={() => setModalType(null)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🛡️ Vital Safety Guidelines</h3>
            <ul>
              <li>🚧 Always wear a hard hat (helmet) & safety shoes on the shop floor.</li>
              <li>⚠️ Report any hazard or unsafe condition immediately to the Admin.</li>
              <li>🦺 High-visibility vests must be worn in active transport areas.</li>
              <li>🧴 Wash hands and sanitize before using equipment controls.</li>
            </ul>
            <button className="modal-close-btn" onClick={() => setModalType(null)}>Understood</button>
          </div>
        </div>
      )}

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

export default Login;