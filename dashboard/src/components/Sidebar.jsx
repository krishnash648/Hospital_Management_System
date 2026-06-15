import { Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaHistory,
  FaFileMedical,
  FaCog,
  FaRobot,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
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
          <Link to="/reports">
            <FaFileMedical /> Medical Reports
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
  );
};

export default Sidebar;
