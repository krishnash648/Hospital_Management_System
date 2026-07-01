import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";
import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaFileMedical,
  FaPrescriptionBottleAlt,
  FaArrowUp,
  FaClipboardList,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalReports: 0,
    totalPrescriptions: 0,
    latestDoctor: null,
    latestPatient: null,
    latestAppointment: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await API.get("/admin/stats");
        setStats(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const barData = [
    { name: "Doctors", count: stats.totalDoctors },
    { name: "Patients", count: stats.totalPatients },
    { name: "Appointments", count: stats.totalAppointments },
    { name: "Reports", count: stats.totalReports },
    { name: "Prescriptions", count: stats.totalPrescriptions },
  ];

  const pieData = [
    { name: "Doctors", value: stats.totalDoctors },
    { name: "Patients", value: stats.totalPatients },
    { name: "Appointments", value: stats.totalAppointments },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  if (loading) {
    return (
      <section className="dashboard-layout">
        <AdminSidebar />
        <div className="dashboard-main">
          <AdminNavbar />
          <div className="dashboard-content">
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-layout">
      <AdminSidebar />

      <div className="dashboard-main">
        <AdminNavbar />

        <div className="dashboard-content">
          {/* Hero */}
          <div className="admin-hero-card">
            <div>
              <h1>Hospital Control Center 🏥</h1>
              <p>
                Monitor hospital operations, staff, patients, reports and
                appointments from one place.
              </p>
            </div>

            <div className="hero-badge">
              <FaArrowUp />
              System Active
            </div>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <FaUserMd className="stat-icon" />
              <h2>{stats.totalDoctors}</h2>
              <p>Total Doctors</p>
            </div>

            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <h2>{stats.totalPatients}</h2>
              <p>Total Patients</p>
            </div>

            <div className="stat-card">
              <FaCalendarCheck className="stat-icon" />
              <h2>{stats.totalAppointments}</h2>
              <p>Total Appointments</p>
            </div>

            <div className="stat-card">
              <FaFileMedical className="stat-icon" />
              <h2>{stats.totalReports}</h2>
              <p>Total Reports</p>
            </div>

            <div className="stat-card">
              <FaPrescriptionBottleAlt className="stat-icon" />
              <h2>{stats.totalPrescriptions}</h2>
              <p>Total Prescriptions</p>
            </div>
          </div>

          {/* Charts */}
          <div className="admin-bottom-grid">
            <div className="dashboard-box">
              <h2>Hospital Analytics</h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2d9cdb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-box">
              <h2>Hospital Distribution</h2>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="admin-bottom-grid">
            <div className="dashboard-box">
              <h2>
                <FaClipboardList /> Recent Activity
              </h2>

              <div className="activity-item">
                <strong>Latest Doctor:</strong>
                <p>
                  {stats.latestDoctor
                    ? `${stats.latestDoctor.name} (${stats.latestDoctor.specialization})`
                    : "No doctor found"}
                </p>
              </div>

              <div className="activity-item">
                <strong>Latest Patient:</strong>
                <p>
                  {stats.latestPatient
                    ? stats.latestPatient.name
                    : "No patient found"}
                </p>
              </div>

              <div className="activity-item">
                <strong>Latest Appointment:</strong>
                <p>
                  {stats.latestAppointment
                    ? `${stats.latestAppointment.patient?.name} with Dr. ${stats.latestAppointment.doctor?.name}`
                    : "No appointment found"}
                </p>
              </div>
            </div>

            <div className="dashboard-box">
              <h2>Quick Summary</h2>

              <div className="summary-item">
                <span>Doctors Available</span>
                <strong>{stats.totalDoctors}</strong>
              </div>

              <div className="summary-item">
                <span>Patients Registered</span>
                <strong>{stats.totalPatients}</strong>
              </div>

              <div className="summary-item">
                <span>Reports Uploaded</span>
                <strong>{stats.totalReports}</strong>
              </div>

              <div className="summary-item">
                <span>Prescriptions Issued</span>
                <strong>{stats.totalPrescriptions}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;
