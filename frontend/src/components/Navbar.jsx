import { FaChevronDown } from "react-icons/fa";
import { useContext, useState } from "react";
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
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/user/patient/logout",
        {
          withCredentials: true,
        },
      );

      toast.success(res.data.message);
      setIsAuthenticated(false);
      navigateTo("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout Failed");
    }
  };

  const goToLogin = () => {
    navigateTo("/login");
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

          <div className="dropdown">
            <span className="dropdown-title">
              About Us
              <FaChevronDown />
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
            <button className="btn appointmentBtn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="btn loginBtn" onClick={goToLogin}>
                Login
              </button>

              <Link to="/appointment" onClick={() => setShow(false)}>
                <button className="btn appointmentBtn">Book Appointment</button>
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
