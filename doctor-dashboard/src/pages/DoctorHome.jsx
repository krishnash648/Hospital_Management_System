import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaClock,
  FaFileMedical,
  FaPrescriptionBottleAlt,
  FaStar,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const [appointmentRes, reportRes, analyticsRes] = await Promise.all([
          API.get("/doctors/my-appointments"),
          API.get("/doctors/reports"),
          API.get("/doctors/analytics"),
        ]);

        setAppointments(appointmentRes.data);
        setReports(reportRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  if (loading || !analytics) {
    return (
      <section className="dashboard-layout">
        <DoctorSidebar />

        <div className="dashboard-main">
          <DoctorNavbar />

          <div className="dashboard-content">
            <h2>Loading dashboard...</h2>
          </div>
        </div>
      </section>
    );
  }

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = monthLabels.map((month, index) => ({
    month,
    appointments: analytics.monthlyAppointments[index],
  }));

  const pieData = [
    {
      name: "Pending",
      value: analytics.pendingAppointments,
    },
    {
      name: "Approved",
      value: analytics.approvedAppointments,
    },
    {
      name: "Completed",
      value: analytics.completedAppointments,
    },
    {
      name: "Cancelled",
      value: analytics.cancelledAppointments,
    },
    {
      name: "Rejected",
      value: analytics.rejectedAppointments,
    },
  ];

  const ratingData = [
    { rating: "1★", total: analytics.ratings[1] },
    { rating: "2★", total: analytics.ratings[2] },
    { rating: "3★", total: analytics.ratings[3] },
    { rating: "4★", total: analytics.ratings[4] },
    { rating: "5★", total: analytics.ratings[5] },
  ];

  const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="welcome-card">
            <h1>Welcome Back Doctor 👋</h1>

            <p>
              Monitor appointments, reports, prescriptions, patients and
              analytics.
            </p>
          </div>

          {/* Statistics */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <FaUserInjured className="stat-icon" />
              <h2>{analytics.totalPatients}</h2>
              <p>Total Patients</p>
            </div>

            <div className="stat-card">
              <FaClock className="stat-icon" />
              <h2>{analytics.pendingAppointments}</h2>
              <p>Pending Appointments</p>
            </div>

            <div className="stat-card">
              <FaCalendarCheck className="stat-icon" />
              <h2>{analytics.approvedAppointments}</h2>
              <p>Approved Appointments</p>
            </div>

            <div className="stat-card">
              <FaCalendarCheck className="stat-icon" />
              <h2>{analytics.completedAppointments}</h2>
              <p>Completed Appointments</p>
            </div>

            <div className="stat-card">
              <FaFileMedical className="stat-icon" />
              <h2>{analytics.totalReports}</h2>
              <p>Total Reports</p>
            </div>

            <div className="stat-card">
              <FaPrescriptionBottleAlt className="stat-icon" />
              <h2>{analytics.totalPrescriptions}</h2>
              <p>Total Prescriptions</p>
            </div>

            <div className="stat-card">
              <FaClock className="stat-icon" />
              <h2>{analytics.todayAppointments}</h2>
              <p>Today's Appointments</p>
            </div>

            <div className="stat-card">
              <FaStar className="stat-icon" />
              <h2>{analytics.averageRating}</h2>
              <p>Average Rating</p>
            </div>
          </div>

          {/* ================= Analytics ================= */}

          <div className="dashboard-box">
            <h2>Monthly Appointments</h2>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line
                  type="linear"
                  dataKey="appointments"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))",
              gap: "25px",
              marginTop: "30px",
            }}
          >
            <div className="dashboard-box">
              <h2>Appointment Status</h2>

              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-box">
              <h2>Rating Distribution</h2>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="rating" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Legend />

                  <Bar dataKey="total" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ================= Recent Appointments ================= */}

          <div className="dashboard-box">
            <h2>Recent Appointments</h2>

            {appointments.length > 0 ? (
              appointments.slice(0, 5).map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <h3>{appointment.patient?.name}</h3>

                  <p>{appointment.department}</p>

                  <p>{appointment.date?.split("T")[0]}</p>

                  <span className={`status ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
              ))
            ) : (
              <p>No appointments found.</p>
            )}
          </div>
          {/* ================= Recent Reports ================= */}

          <div className="dashboard-box">
            <h2>Recent Reports</h2>

            {reports.length > 0 ? (
              reports.slice(0, 5).map((report) => (
                <div key={report._id} className="appointment-card">
                  <h3>{report.patient?.name}</h3>

                  <p>{report.title || "Medical Report"}</p>

                  <p>{new Date(report.createdAt).toLocaleDateString()}</p>

                  <span className="status completed">Uploaded</span>
                </div>
              ))
            ) : (
              <p>No reports found.</p>
            )}
          </div>

          {/* ================= Quick Analytics ================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            <div className="dashboard-box">
              <h3>Total Reviews</h3>
              <h1>{analytics.totalReviews}</h1>
            </div>

            <div className="dashboard-box">
              <h3>Cancelled</h3>
              <h1>{analytics.cancelledAppointments}</h1>
            </div>

            <div className="dashboard-box">
              <h3>Rejected</h3>
              <h1>{analytics.rejectedAppointments}</h1>
            </div>

            <div className="dashboard-box">
              <h3>Success Rate</h3>

              <h1>
                {appointments.length === 0
                  ? "0%"
                  : `${Math.round(
                      (analytics.completedAppointments / appointments.length) *
                        100,
                    )}%`}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorHome;
