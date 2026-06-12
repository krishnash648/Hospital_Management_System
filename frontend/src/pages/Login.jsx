import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        {
          email,
          password,
          role: "Patient",
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      toast.success(data.message);
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

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
              Sign in to manage appointments, connect with healthcare
              professionals, and access your healthcare services securely.
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

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
