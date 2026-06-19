import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/forgot-password", {
        email,
      });

      toast.success("📩 Reset link sent successfully! Check your email.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to send reset link",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        },
      );
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p>Enter your registered email to receive a reset link.</p>

        <form onSubmit={handleForgotPassword} className="auth-form">
          <div className="input-group">
            <FaEnvelope />
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Send Reset Link
          </button>
        </form>

        <Link to="/login" className="auth-link">
          Back to Login
        </Link>
      </div>
    </section>
  );
};

export default ForgotPassword;
