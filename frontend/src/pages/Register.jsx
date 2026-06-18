import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../context/context";
import { Link, Navigate, useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        phone,
        password,
        role: "patient",
      });

      localStorage.setItem("token", data.token);
      toast.success("Registration successful");
      setIsAuthenticated(true);

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");

      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <section className="login-section">
      <div className="container">
        <div className="login-card register-card">
          <div className="login-image">
            <img src="/register.png" alt="Patient Registration" />
          </div>

          <div className="login-content">
            <span className="login-badge">Create Patient Account</span>

            <h2>Create Account</h2>

            <p className="login-desc">
              Register to book appointments and manage your healthcare.
            </p>

            <form onSubmit={handleRegistration}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">Create Account</button>

              <p className="register-text">
                Already have an account?
                <Link to="/login"> Login Now</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
