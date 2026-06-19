import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { useState } from "react";

const DashboardNavbar = () => {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const goBackToWebsite = () => {
    window.location.href = "http://localhost:5173";
  };

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-left">
        <img
          src="/logo.png"
          alt="Goldvalley Clinic"
          className="dashboard-logo"
        />
      </div>

      <div className="dashboard-navbar-right">
        <button className="back-btn" onClick={goBackToWebsite}>
          <FaArrowLeft /> Back to Website
        </button>

        <div className="profile-box">
          <FaUserCircle />
          <span>{user?.name || "Patient"}</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
