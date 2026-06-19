import { FaChevronDown } from "react-icons/fa";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { toast } from "react-toastify";
import { Context } from "../context/context";
import API from "../services/api";

const Navbar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout API error:", err);
    }

    // Always clear client auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUser(null);

    toast.success("Logged out successfully");

    window.location.href = "http://localhost:5173/login";
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

  const goToDashboard = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    window.location.href = `http://localhost:5174?token=${token}`;
  };

  return (
    <nav className="container navbar">
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

          <Link to="/doctors" onClick={() => setShow(false)}>
            Doctors
          </Link>

          <Link to="/departments" onClick={() => setShow(false)}>
            Departments
          </Link>

          <div className="dropdown">
            <span className="dropdown-title">
              About Us <FaChevronDown />
            </span>

            <div className="dropdown-menu">
              <Link to="/about" onClick={() => setShow(false)}>
                About Us
              </Link>

              <Link to="/testimonials" onClick={() => setShow(false)}>
                Testimonials
              </Link>

              <Link to="/faq" onClick={() => setShow(false)}>
                FAQ
              </Link>

              <Link to="/contact" onClick={() => setShow(false)}>
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <button className="btn loginBtn" onClick={goToDashboard}>
                Dashboard
              </button>

              <button className="btn appointmentBtn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn loginBtn" onClick={goToLogin}>
                Login
              </button>

              <Link to="/register" onClick={() => setShow(false)}>
                <button className="btn appointmentBtn">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
