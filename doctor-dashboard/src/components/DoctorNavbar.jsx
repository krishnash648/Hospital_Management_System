import { useEffect, useState } from "react";
import { FaUserMd, FaBell } from "react-icons/fa";
import API from "../services/api";
import { toast } from "react-toastify";

const DoctorNavbar = () => {
  const doctorName = localStorage.getItem("doctorName") || "Doctor";

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/doctors/notifications");
      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchNotifications();
    };

    init();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await API.put("/doctors/notifications/read");

      fetchNotifications();

      toast.success("Notifications marked as read");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update notifications");
    }
  };

  return (
    <nav className="dashboard-navbar">
      <button
        className="back-btn"
        onClick={() => (window.location.href = "http://localhost:5173/")}
      >
        ← Back to Website
      </button>

      <div className="dashboard-navbar-right">
        <div className="doctor-notification-wrapper">
          <button
            className="doctor-notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />

            {unreadCount > 0 && (
              <span className="doctor-notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="doctor-notification-dropdown">
              <div className="doctor-notification-header">
                <h4>Notifications</h4>

                {notifications.length > 0 && (
                  <button className="doctor-read-btn" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="doctor-empty-notification">No notifications</p>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`doctor-notification-item ${
                      notification.read ? "" : "unread"
                    }`}
                  >
                    <p>{notification.message}</p>

                    <small>
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="profile-box">
          <FaUserMd />
          <span>{doctorName}</span>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
