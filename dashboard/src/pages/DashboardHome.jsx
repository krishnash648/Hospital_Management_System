import Sidebar from "../components/Sidebar";
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
  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome Back, Krish 👋</h1>
          <p>Track appointments, reports, and your health journey.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <FaCalendarCheck className="stat-icon" />
            <h2>5</h2>
            <p>Upcoming Appointments</p>
          </div>

          <div className="stat-card">
            <FaHospital className="stat-icon" />
            <h2>12</h2>
            <p>Total Visits</p>
          </div>

          <div className="stat-card">
            <FaFileMedical className="stat-icon" />
            <h2>4</h2>
            <p>Medical Reports</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-box">
            <h2>Upcoming Appointment</h2>

            <div className="appointment-card">
              <h3>Dr. Sarah Wilson</h3>
              <p>Cardiology Department</p>
              <p>18 June 2026 - 10:30 AM</p>
              <span className="status upcoming">Upcoming</span>

              <div className="appointment-actions">
                <button className="reschedule-btn">Reschedule</button>
                <button className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>

          <div className="dashboard-box">
            <h2>
              <FaBell /> Notifications
            </h2>

            <div className="notification-item success">
              Appointment confirmed for tomorrow
            </div>

            <div className="notification-item info">Blood report uploaded</div>

            <div className="notification-item warning">
              Prescription updated
            </div>
          </div>

          <div className="dashboard-box">
            <h2>
              <FaHeartbeat /> Health Summary
            </h2>

            <div className="health-item">
              <p>Weight (72kg)</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "72%" }}></div>
              </div>
            </div>

            <div className="health-item">
              <p>Hydration</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "80%" }}></div>
              </div>
            </div>

            <div className="health-item">
              <p>Heart Rate Stability</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "90%" }}></div>
              </div>
            </div>

            <div className="health-item">
              <p>Sleep Quality</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "65%" }}></div>
              </div>
            </div>

            <p>
              <strong>Blood Group:</strong> O+
            </p>
          </div>

          <div className="dashboard-box">
            <h2>
              <FaPills /> Prescriptions
            </h2>

            <ul className="dashboard-list">
              <li>Paracetamol 500mg</li>
              <li>Vitamin D Tablets</li>
              <li>BP Control Medication</li>
            </ul>
          </div>

          <div className="dashboard-box">
            <h2>
              <FaFileMedical /> Recent Reports
            </h2>

            <ul className="dashboard-list">
              <li>
                Blood Test Report <button>View</button>
              </li>
              <li>
                MRI Scan <button>View</button>
              </li>
              <li>
                X-Ray Report <button>View</button>
              </li>
            </ul>
          </div>

          <div className="dashboard-box">
            <h2>
              <FaUserMd /> Doctor Notes
            </h2>
            <ul className="dashboard-list">
              <li>Take medicines after meals</li>
              <li>Reduce salt intake</li>
              <li>Follow-up after 7 days</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;
