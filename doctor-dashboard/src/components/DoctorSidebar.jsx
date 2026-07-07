import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaUserInjured,
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaCog,
  FaSignOutAlt,
  FaStar,
} from "react-icons/fa";

const DoctorSidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("http://localhost:5173/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Appointments", path: "/appointments", icon: <FaCalendarCheck /> },
    { name: "Patients", path: "/patients", icon: <FaUserInjured /> },
    {
      name: "Prescriptions",
      path: "/prescriptions",
      icon: <FaPrescriptionBottleAlt />,
    },
    { name: "Reports", path: "/reports", icon: <FaFileMedical /> },
    {
      name: "Reviews",
      path: "/reviews",
      icon: <FaStar />,
    },
    { name: "Settings", path: "/settings", icon: <FaCog /> },
  ];

  return (
    <aside className="sidebar">
      <h2>Doctor Panel</h2>

      <ul>
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
