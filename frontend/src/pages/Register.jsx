import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../context/context";
import { Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const { setIsAuthenticated } = useContext(Context);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [specialization, setSpecialization] = useState("");

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        phone,
        password,
        role,
        specialization: role === "doctor" ? specialization : "",
      });

      // clear old auth sessions only
      localStorage.removeItem("token");
      localStorage.removeItem("doctorToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      localStorage.removeItem("doctorName");
      localStorage.removeItem("adminName");

      if (data.role === "doctor") {
        localStorage.setItem("doctorToken", data.token);
        localStorage.setItem("doctorName", data.name);
        localStorage.setItem("role", "doctor");

        toast.success("Registration successful");

        window.location.replace(
          `http://localhost:5175/?token=${data.token}&name=${encodeURIComponent(data.name)}`,
        );

        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("role", "patient");

      toast.success("Registration successful");
      setIsAuthenticated(true);

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("patient");
      setSpecialization("");

      // Redirect patient to patient dashboard with token in URL
      window.location.replace(
        `http://localhost:5174/?token=${data.token}&name=${encodeURIComponent(data.name)}`,
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="login-section">
      <div className="container">
        <div className="login-card register-card">
          <div className="login-image">
            <img src="/register.png" alt="Registration" />
          </div>

          <div className="login-content">
            <span className="login-badge">Create Account</span>

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

              <div className="select-wrapper">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
              {role === "doctor" && (
                <input
                  type="text"
                  placeholder="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
              )}

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
