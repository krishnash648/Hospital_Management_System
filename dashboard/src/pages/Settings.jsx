import Sidebar from "../components/Sidebar";
import { FaUserEdit, FaLock, FaBell, FaMoon } from "react-icons/fa";

const Settings = () => {
  return (
    <section className="dashboard-layout">
      <Sidebar />

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
              <input type="text" placeholder="Full Name" value="Krish" />
              <input type="email" placeholder="Email" value="krish@gmail.com" />
              <input
                type="tel"
                placeholder="Phone Number"
                value="+91 9876543210"
              />
              <button className="save-btn">Save Changes</button>
            </div>
          </div>

          <div className="settings-card">
            <h2>
              <FaLock /> Change Password
            </h2>

            <div className="settings-form">
              <input type="password" placeholder="Current Password" />
              <input type="password" placeholder="New Password" />
              <input type="password" placeholder="Confirm New Password" />
              <button className="save-btn">Update Password</button>
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
    </section>
  );
};

export default Settings;
