import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaUserInjured,
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

const DoctorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctorName");

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
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
