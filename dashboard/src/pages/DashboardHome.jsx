import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

const DashboardHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);

  const navigate = useNavigate();

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
      setHealthData(data?.length ? data[0] : null);
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

  useEffect(() => {
    const loadDashboardData = async () => {
      await Promise.all([
        fetchAppointments(),
        fetchHealth(),
        fetchPrescriptions(),
        fetchReports(),
      ]);
    };

    loadDashboardData();
  }, [fetchAppointments, fetchHealth, fetchPrescriptions, fetchReports]);

  const cancelAppointment = async (id) => {
    try {
      await API.delete(`/appointments/${id}`);
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel appointment");
    }
  };

  const upcomingAppointment = appointments[0];

  const totalAppointments = appointments.length;

  const approvedAppointments = appointments.filter(
    (appointment) => appointment.status === "approved",
  ).length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          <div className="welcome-card">
            <h1>Welcome Back 👋</h1>
            <p>Track appointments, reports, and your health journey.</p>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <FaCalendarCheck className="stat-icon" />
              <h2>{pendingAppointments}</h2>
              <p>Upcoming Appointments</p>
            </div>

            <div className="stat-card">
              <FaHospital className="stat-icon" />
              <h2>{approvedAppointments}</h2>
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
                      onClick={() => navigate("/appointment")}
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

              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="notification-item success"
                  >
                    Appointment with Dr. {appointment.doctor?.name || "Unknown"}{" "}
                    is {appointment.status}
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
                        style={{ width: `${healthData.weight}%` }}
                      />
                    </div>
                  </div>

                  <div className="health-item">
                    <p>Hydration</p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${healthData.hydration}%` }}
                      />
                    </div>
                  </div>

                  <div className="health-item">
                    <p>Heart Rate Stability</p>
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
                    <p>Sleep Quality</p>
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
                    <li key={prescription._id}>{prescription.medicineName}</li>
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
                      <button>View</button>
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

              {reports.length > 0 ? (
                <ul className="dashboard-list">
                  {reports.map((report) => (
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
