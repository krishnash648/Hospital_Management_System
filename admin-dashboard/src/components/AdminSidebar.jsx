import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaFileMedical,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminSidebar = () => {
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    localStorage.removeItem("role");

    window.location.replace("http://localhost:5173/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: <FaUserMd />,
    },
    {
      name: "Patients",
      path: "/patients",
      icon: <FaUsers />,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: <FaCalendarCheck />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaFileMedical />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Admin Panel</h2>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}

        <li>
          <button className="logout-btn" onClick={logoutHandler}>
            <FaSignOutAlt /> Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
