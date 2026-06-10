import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const navigateTo = useNavigate();
  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/patient/register",
        {
          firstName,
          lastName,
          email,
          phone,
          nic,
          dob,
          gender,
          password,
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
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setPassword("");

      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
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
              Register to book appointments, manage your healthcare records, and
              connect with our experienced medical professionals.
            </p>

            <form onSubmit={handleRegistration}>
              <div className="register-row">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />

                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="register-row">
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
              </div>

              <div className="register-row">
                <input
                  type="text"
                  placeholder="Government ID"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  required
                />

                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              <div className="register-row">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

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
