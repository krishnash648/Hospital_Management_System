import { FaUserMd } from "react-icons/fa";

const DoctorNavbar = () => {
  const doctorName = localStorage.getItem("doctorName") || "Doctor";

  return (
    <nav className="dashboard-navbar">
      <button
        className="back-btn"
        onClick={() => (window.location.href = "http://localhost:5173")}
      >
        ← Back to Website
      </button>

      <div className="dashboard-navbar-right">
        <div className="profile-box">
          <FaUserMd />
          <span>{doctorName}</span>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
