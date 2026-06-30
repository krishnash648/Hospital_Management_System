import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaHistory,
  FaFileMedical,
  FaPrescriptionBottleAlt,
  FaCog,
  FaRobot,
  FaSignOutAlt,
  FaHeartbeat,
} from "react-icons/fa";
import { useContext } from "react";
import { Context } from "../context/context";
import API from "../services/api";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout API error:", err);
    }

    // clear patient session completely
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");

    setIsAuthenticated(false);
    setUser(null);

    toast.success("Logged out successfully");

    window.location.href = "http://localhost:5173/login";
  };

  return (
    <div className="sidebar">
      <div>
        <h2>Patient Panel</h2>

        <ul>
          <li>
            <Link to="/">
              <FaHome /> Dashboard
            </Link>
          </li>

          <li>
            <Link to="/appointments">
              <FaCalendarAlt /> My Appointments
            </Link>
          </li>

          <li>
            <Link to="/history">
              <FaHistory /> Appointment History
            </Link>
          </li>

          <li>
            <Link to="/health-summary">
              <FaHeartbeat /> Health Summary
            </Link>
          </li>

          <li>
            <Link to="/reports">
              <FaFileMedical /> Medical Reports
            </Link>
          </li>

          <li>
            <Link to="/prescriptions">
              <FaPrescriptionBottleAlt /> Prescriptions
            </Link>
          </li>

          <li>
            <Link to="/assistant">
              <FaRobot /> AI Assistant
            </Link>
          </li>

          <li>
            <Link to="/settings">
              <FaCog /> Settings
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
