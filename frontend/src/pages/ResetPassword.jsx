import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const { data } = await API.put(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success(data.message, {
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>

        <form onSubmit={handleResetPassword} className="auth-form">
          <div className="input-group">
            <FaLock />
            <input
              type="password"
              placeholder="New Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
