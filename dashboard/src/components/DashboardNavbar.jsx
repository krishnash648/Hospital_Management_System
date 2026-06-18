import { FaArrowLeft, FaUserCircle } from "react-icons/fa";

const DashboardNavbar = () => {
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
          <span>Patient</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
