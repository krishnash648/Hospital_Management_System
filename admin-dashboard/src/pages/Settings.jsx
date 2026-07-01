import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";
import {
  FaUserShield,
  FaSignOutAlt,
  FaDatabase,
  FaLock,
  FaServer,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Settings = () => {
  const adminName = localStorage.getItem("adminName") || "Admin";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName");
    localStorage.removeItem("role");

    window.location.replace("http://localhost:5173/login");
  };

  return (
    <section className="dashboard-layout">
      <AdminSidebar />

      <div className="dashboard-main">
        <AdminNavbar />

        <div className="dashboard-content">
          <div className="admin-hero-card">
            <div>
              <h1>Admin Settings ⚙️</h1>
              <p>Manage your admin profile, security and system settings.</p>
            </div>

            <div className="hero-badge">
              <FaUserShield />
              Admin Access
            </div>
          </div>

          <div className="settings-grid">
            {/* Profile */}
            <div className="settings-card">
              <h3>
                <FaUserShield /> Profile
              </h3>
              <p>
                <strong>Name:</strong> {adminName}
              </p>
              <p>
                <strong>Role:</strong> Administrator
              </p>
              <p>
                <strong>Status:</strong> Active
              </p>
            </div>

            {/* Security */}
            <div className="settings-card">
              <h3>
                <FaLock /> Change Password
              </h3>

              <form onSubmit={handleChangePassword}>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="settings-input"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="settings-input"
                />

                <button type="submit" className="view-btn">
                  Update Password
                </button>
              </form>
            </div>

            {/* System */}
            <div className="settings-card">
              <h3>
                <FaServer /> System
              </h3>
              <p>Backend Server: Running</p>
              <p>Database: Connected</p>
              <p>API Status: Healthy</p>
            </div>

            {/* Database */}
            <div className="settings-card">
              <h3>
                <FaDatabase /> Database
              </h3>
              <p>MongoDB Connected</p>
              <p>Patient Records Synced</p>
              <p>Reports Storage Active</p>
            </div>
          </div>

          <div className="danger-zone">
            <h3>Danger Zone</h3>
            <p>Logout from admin panel securely.</p>

            <button className="danger-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
