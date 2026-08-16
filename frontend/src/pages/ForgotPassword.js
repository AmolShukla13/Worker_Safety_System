import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { FaEnvelope, FaKey, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import "../styles/Login.css";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  // Step 1: Request OTP, Step 2: Verify OTP & New Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error' | 'info', text: string }
  const [devOtp, setDevOtp] = useState(null); // For development display

  // Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      
      setMessage({
        type: "success",
        text: res.data.message || "OTP has been sent to your email!"
      });

      if (res.data.otp) {
        setDevOtp(res.data.otp);
      }

      setStep(2);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send OTP. Please check your email."
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!otp) {
      setMessage({ type: "error", text: "Please enter the 6-digit OTP code." });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setMessage({
        type: "success",
        text: res.data.message || "Password reset successful! Redirecting to login..."
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to reset password. Check your OTP."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-header">
          <h1>Worker <span>Safety</span> System</h1>
          <p>ENSURE YOUR SAFETY, EVERY DAY!</p>
        </div>

        <div className="login-box-wrapper">
          <div className="login-box forgot-box">
            <h2>{step === 1 ? "Forgot Password" : "Reset Your Password"}</h2>
            
            <p className="forgot-subtitle">
              {step === 1 
                ? "Enter your registered Gmail address below and we'll send you an OTP to reset your password."
                : `Enter the 6-digit OTP sent to ${email} along with your new password.`}
            </p>

            {message && (
              <div className={`alert-banner alert-${message.type}`}>
                {message.type === "success" && <FaCheckCircle className="alert-icon" />}
                {message.type === "error" && <FaExclamationTriangle className="alert-icon" />}
                <span>{message.text}</span>
              </div>
            )}

            {devOtp && step === 2 && (
              <div className="dev-otp-box">
                <span className="dev-otp-title">💡 Dev Testing OTP Code:</span>
                <span className="dev-otp-code">{devOtp}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestOTP}>
                <div className="input-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Registered Email (Gmail)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Sending OTP..." : "SEND OTP CODE"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="input-group">
                  <FaKey className="input-icon" />
                  <input
                    type="text"
                    name="otp"
                    placeholder="6-Digit OTP Code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>

                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Resetting Password..." : "RESET PASSWORD"}
                </button>
              </form>
            )}

            <div className="forgot-footer-actions">
              {step === 2 && (
                <button
                  type="button"
                  className="resend-otp-btn"
                  onClick={handleRequestOTP}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}

              <Link to="/login" className="back-to-login">
                <FaArrowLeft /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
