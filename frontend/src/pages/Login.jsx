import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.clear();

      if (data.role === "doctor") {
        localStorage.setItem("doctorToken", data.token);
        localStorage.setItem("doctorName", data.name);
        localStorage.setItem("role", "doctor");

        toast.success("Doctor login successful");

        window.location.replace(
          `http://localhost:5175/?token=${data.token}&name=${encodeURIComponent(data.name)}`,
        );

        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("role", "patient");

      toast.success("Patient login successful", {
        theme: "colored",
      });

      setEmail("");
      setPassword("");

      // Redirect patient to patient dashboard with token in URL
      window.location.replace(
        `http://localhost:5174/?token=${data.token}&name=${encodeURIComponent(data.name)}`,
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="login-section">
      <div className="container">
        <div className="login-card">
          <div className="login-image">
            <img src="/signin.png" alt="Healthcare Login" />
          </div>

          <div className="login-content">
            <span className="login-badge">Secure Patient Portal</span>

            <h2>Welcome Back</h2>

            <p className="login-desc">
              Sign in to manage appointments and access healthcare services.
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email Address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="forgot-password">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <button type="submit">Sign In</button>

              <p className="register-text">
                Do not have an account?
                <Link to="/register"> Register Now</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
