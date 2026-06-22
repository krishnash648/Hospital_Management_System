import { FaArrowLeft, FaUserCircle } from "react-icons/fa";

const DashboardNavbar = () => {
  const userName = localStorage.getItem("userName") || "Patient";

  const goBackToWebsite = () => {
    window.location.href = "http://localhost:5173";
  };

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-left"></div>

      <div className="dashboard-navbar-right">
        <button className="back-btn" onClick={goBackToWebsite}>
          <FaArrowLeft /> Back to Website
        </button>

        <div className="profile-box">
          <FaUserCircle />
          <span>{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
