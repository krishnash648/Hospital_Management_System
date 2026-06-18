import { useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import { FaUserEdit, FaLock, FaBell, FaMoon } from "react-icons/fa";
import { Context } from "../context/context";
import API from "../services/api";
import { toast } from "react-toastify";

const Settings = () => {
  const { user, setUser } = useContext(Context);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileUpdate = async () => {
    try {
      const { data } = await API.put("/auth/profile", {
        name,
        email,
        phone,
      });

      setUser(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Settings</h1>
            <p>Manage your account preferences and personal information.</p>
          </div>

          <div className="settings-grid">
            <div className="settings-card">
              <h2>
                <FaUserEdit /> Profile Information
              </h2>

              <div className="settings-form">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <button className="save-btn" onClick={handleProfileUpdate}>
                  Save Changes
                </button>
              </div>
            </div>

            <div className="settings-card">
              <h2>
                <FaLock /> Change Password
              </h2>

              <div className="settings-form">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button className="save-btn" onClick={handlePasswordUpdate}>
                  Update Password
                </button>
              </div>
            </div>

            <div className="settings-card">
              <h2>
                <FaBell /> Notification Preferences
              </h2>

              <div className="toggle-group">
                <label>
                  Appointment Alerts
                  <input type="checkbox" defaultChecked />
                </label>

                <label>
                  Medical Report Updates
                  <input type="checkbox" defaultChecked />
                </label>

                <label>
                  AI Health Suggestions
                  <input type="checkbox" />
                </label>
              </div>
            </div>

            <div className="settings-card">
              <h2>
                <FaMoon /> Appearance
              </h2>

              <div className="toggle-group">
                <label>
                  Dark Mode
                  <input type="checkbox" />
                </label>

                <label>
                  Compact Layout
                  <input type="checkbox" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
