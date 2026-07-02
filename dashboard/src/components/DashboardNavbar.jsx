import { useState, useEffect } from "react";
import { FaArrowLeft, FaUserCircle, FaBell } from "react-icons/fa";
import API from "../services/api";

const DashboardNavbar = () => {
  const userName = localStorage.getItem("userName") || "Patient";

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const goBackToWebsite = () => {
    window.location.href = "http://localhost:5173";
  };

  const handleToggleNotifications = async () => {
    setShowNotifications(!showNotifications);

    if (!showNotifications) {
      try {
        await API.put("/auth/notifications/read");

        setNotifications((prev) =>
          prev.map((item) => ({
            ...item,
            read: true,
          })),
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const { data } = await API.get("/auth/notifications");

        if (mounted) {
          setNotifications(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-left"></div>

      <div className="dashboard-navbar-right">
        <button className="back-btn" onClick={goBackToWebsite}>
          <FaArrowLeft /> Back to Website
        </button>

        <div className="notification-box">
          <button
            className="notification-btn"
            onClick={handleToggleNotifications}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`notification-item ${
                      notification.read ? "read" : "unread"
                    }`}
                  >
                    <p>{notification.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="profile-box">
          <FaUserCircle />
          <span>{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
