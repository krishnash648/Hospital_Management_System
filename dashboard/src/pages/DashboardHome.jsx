import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  FaBell,
  FaHeartbeat,
  FaFileMedical,
  FaPills,
  FaUserMd,
  FaCalendarCheck,
  FaHospital,
  FaEye,
} from "react-icons/fa";

const DashboardHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchAppointments = useCallback(async () => {
    try {
      const { data } = await API.get("/appointments/my");
      setAppointments(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load appointments");
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const { data } = await API.get("/health/my");
      setHealthData(data || null);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchPrescriptions = useCallback(async () => {
    try {
      const { data } = await API.get("/prescriptions/my");
      setPrescriptions(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      const { data } = await API.get("/reports/my");
      setReports(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await API.get("/auth/notifications");
      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      await Promise.allSettled([
        fetchAppointments(),
        fetchHealth(),
        fetchPrescriptions(),
        fetchReports(),
        fetchNotifications(),
      ]);
    };

    loadDashboardData();
  }, [
    fetchAppointments,
    fetchHealth,
    fetchPrescriptions,
    fetchReports,
    fetchNotifications,
  ]);

  const cancelAppointment = async (id) => {
    try {
      await API.put(`/appointments/${id}/cancel`);
      toast.success("Appointment cancelled");

      fetchAppointments();
      fetchNotifications();
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel appointment");
    }
  };

  const upcomingAppointment = appointments.find(
    (appointment) =>
      appointment.status === "pending" || appointment.status === "approved",
  );

  const totalAppointments = appointments.length;

  const upcomingCount = appointments.filter(
    (appointment) =>
      appointment.status === "pending" || appointment.status === "approved",
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  const doctorNotes = reports.filter((report) => report.doctorNotes);

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          {/* Welcome */}
          <div className="welcome-card">
            <h1>Welcome Back 👋</h1>
            <p>Track appointments, reports, and your health journey.</p>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <FaCalendarCheck className="stat-icon" />
              <h2>{upcomingCount}</h2>
              <p>Upcoming Appointments</p>
            </div>

            <div className="stat-card">
              <FaHospital className="stat-icon" />
              <h2>{completedAppointments}</h2>
              <p>Completed Visits</p>
            </div>

            <div className="stat-card">
              <FaFileMedical className="stat-icon" />
              <h2>{totalAppointments}</h2>
              <p>Total Appointments</p>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Upcoming Appointment */}
            <div className="dashboard-box">
              <h2>Upcoming Appointment</h2>

              {upcomingAppointment ? (
                <div className="appointment-card">
                  <h3>
                    {upcomingAppointment.doctor?.name || "Doctor Not Assigned"}
                  </h3>

                  <p>{upcomingAppointment.department}</p>

                  <p>
                    {upcomingAppointment.date?.split("T")[0]} -{" "}
                    {upcomingAppointment.time}
                  </p>

                  <span className="status upcoming">
                    {upcomingAppointment.status}
                  </span>

                  <div className="appointment-actions">
                    <button
                      className="reschedule-btn"
                      onClick={() =>
                        (window.location.href =
                          "http://localhost:5173/appointment")
                      }
                    >
                      Reschedule
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() => cancelAppointment(upcomingAppointment._id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p>No upcoming appointments found.</p>
              )}
            </div>

            {/* Notifications */}
            <div className="dashboard-box">
              <h2>
                <FaBell /> Notifications
              </h2>

              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification, index) => (
                  <div
                    key={index}
                    className={`notification-item ${
                      notification.read ? "info" : "success"
                    }`}
                  >
                    {notification.message}
                  </div>
                ))
              ) : (
                <div className="notification-item info">
                  No notifications yet
                </div>
              )}
            </div>

            {/* Health Summary */}
            <div className="dashboard-box">
              <h2>
                <FaHeartbeat /> Health Summary
              </h2>

              {healthData ? (
                <>
                  <div className="health-item">
                    <p>Weight ({healthData.weight}kg)</p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(
                            (healthData.weight / 120) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="health-item">
                    <p>Hydration ({healthData.hydration}%)</p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${healthData.hydration}%` }}
                      />
                    </div>
                  </div>

                  <div className="health-item">
                    <p>
                      Heart Rate Stability ({healthData.heartRateStability}%)
                    </p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${healthData.heartRateStability}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="health-item">
                    <p>Sleep Quality ({healthData.sleepQuality}%)</p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${healthData.sleepQuality}%` }}
                      />
                    </div>
                  </div>

                  <p>
                    <strong>Blood Group:</strong> {healthData.bloodGroup}
                  </p>
                </>
              ) : (
                <p>No health data found.</p>
              )}
            </div>

            {/* Prescriptions */}
            <div className="dashboard-box">
              <h2>
                <FaPills /> Prescriptions
              </h2>

              {prescriptions.length > 0 ? (
                <ul className="dashboard-list">
                  {prescriptions.map((prescription) => (
                    <li key={prescription._id}>
                      <p>Medicine:</p>
                      <strong>{prescription.medicineName}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No prescriptions available.</p>
              )}
            </div>

            {/* Recent Reports */}
            <div className="dashboard-box">
              <h2>
                <FaFileMedical /> Recent Reports
              </h2>

              {reports.length > 0 ? (
                <ul className="dashboard-list">
                  {reports.map((report) => (
                    <li key={report._id}>
                      {report.title}

                      <button
                        className="view-btn"
                        onClick={() =>
                          window.open(
                            `http://localhost:5000${report.fileUrl}`,
                            "_blank",
                          )
                        }
                      >
                        <FaEye /> View
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No reports available.</p>
              )}
            </div>

            {/* Doctor Notes */}
            <div className="dashboard-box">
              <h2>
                <FaUserMd /> Doctor Notes
              </h2>

              {doctorNotes.length > 0 ? (
                <ul className="dashboard-list">
                  {doctorNotes.map((report) => (
                    <li key={report._id}>{report.doctorNotes}</li>
                  ))}
                </ul>
              ) : (
                <p>No doctor notes available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;
