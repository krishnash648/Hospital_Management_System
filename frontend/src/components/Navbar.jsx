import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    await axios
      .get("http://localhost:4000/api/v1/user/patient/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

  return (
    <nav className="container">
      <div className="logo">
        <img src="/logo.png" alt="Goldvalley Clinic" className="logo-img" />
      </div>

      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link to="/" onClick={() => setShow(false)}>
            Home
          </Link>

          <Link to="/appointment" onClick={() => setShow(false)}>
            Appointment
          </Link>

          <Link to="/about" onClick={() => setShow(false)}>
            About Us
          </Link>

          <Link to="/doctors" onClick={() => setShow(false)}>
            Doctors
          </Link>
          <Link to="/departments" onClick={() => setShow(false)}>
            Departments
          </Link>
        </div>

        {isAuthenticated ? (
          <button className="book-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div className="nav-actions">
            <button className="btn loginBtn" onClick={goToLogin}>
              Login
            </button>

            <Link to="/appointment" onClick={() => setShow(false)}>
              <button className="btn appointmentBtn">Book Appointment</button>
            </Link>
          </div>
        )}
      </div>

      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
