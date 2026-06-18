import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../context/context";
import { Link, Navigate, useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      toast.success("Login successful");
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
              Sign in to manage appointments and access healthcare services.
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
