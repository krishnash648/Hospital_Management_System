import { useContext, useState, useEffect } from "react";
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

  const [notifications, setNotifications] = useState(
    user?.notificationPreferences || {
      appointmentAlerts: true,
      medicalReports: true,
      aiSuggestions: false,
    },
  );

  const [appearance, setAppearance] = useState(
    user?.appearanceSettings || {
      darkMode: false,
      compactLayout: false,
    },
  );

  // Apply Dark Mode instantly
  useEffect(() => {
    if (appearance.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [appearance.darkMode]);

  // Apply Compact Mode instantly
  useEffect(() => {
    if (appearance.compactLayout) {
      document.body.classList.add("compact-mode");
    } else {
      document.body.classList.remove("compact-mode");
    }
  }, [appearance.compactLayout]);

  const handleProfileUpdate = async () => {
    try {
      const { data } = await API.put("/auth/profile", {
        name,
        email,
        phone,
      });

      setUser(data);

      toast.success("✅ Profile updated successfully!", {
        theme: "colored",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All password fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("🔒 Password updated successfully!", {
        theme: "colored",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  const savePreferences = async (updatedNotifications, updatedAppearance) => {
    try {
      await API.put("/auth/preferences", {
        notificationPreferences: updatedNotifications,
        appearanceSettings: updatedAppearance,
      });

      toast.success("⚙️ Preferences updated successfully!", {
        theme: "colored",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update preferences",
      );
    }
  };

  const handleNotificationChange = async (field) => {
    const updated = {
      ...notifications,
      [field]: !notifications[field],
    };

    setNotifications(updated);
    await savePreferences(updated, appearance);
  };

  const handleAppearanceChange = async (field) => {
    const updated = {
      ...appearance,
      [field]: !appearance[field],
    };

    setAppearance(updated);
    await savePreferences(notifications, updated);
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
            {/* Profile */}
            <div className="settings-card">
              <h2>
                <FaUserEdit /> Profile Information
              </h2>

              <form
                className="settings-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProfileUpdate();
                }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </form>
            </div>

            {/* Password */}
            <div className="settings-card">
              <h2>
                <FaLock /> Change Password
              </h2>

              <form
                className="settings-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePasswordUpdate();
                }}
              >
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  readOnly
                  hidden
                />

                <input
                  type="password"
                  placeholder="Current Password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="New Password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button type="submit" className="save-btn">
                  Update Password
                </button>
              </form>
            </div>

            {/* Notifications */}
            <div className="settings-card">
              <h2>
                <FaBell /> Notification Preferences
              </h2>

              <div className="toggle-group">
                <label>
                  Appointment Alerts
                  <input
                    type="checkbox"
                    checked={notifications.appointmentAlerts}
                    onChange={() =>
                      handleNotificationChange("appointmentAlerts")
                    }
                  />
                </label>

                <label>
                  Medical Report Updates
                  <input
                    type="checkbox"
                    checked={notifications.medicalReports}
                    onChange={() => handleNotificationChange("medicalReports")}
                  />
                </label>

                <label>
                  AI Health Suggestions
                  <input
                    type="checkbox"
                    checked={notifications.aiSuggestions}
                    onChange={() => handleNotificationChange("aiSuggestions")}
                  />
                </label>
              </div>
            </div>

            {/* Appearance */}
            <div className="settings-card">
              <h2>
                <FaMoon /> Appearance
              </h2>

              <div className="toggle-group">
                <label>
                  Dark Mode
                  <input
                    type="checkbox"
                    checked={appearance.darkMode}
                    onChange={() => handleAppearanceChange("darkMode")}
                  />
                </label>

                <label>
                  Compact Layout
                  <input
                    type="checkbox"
                    checked={appearance.compactLayout}
                    onChange={() => handleAppearanceChange("compactLayout")}
                  />
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
