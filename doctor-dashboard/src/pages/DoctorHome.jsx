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
} from "react-icons/fa";

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const { data: appointmentData } = await API.get(
          "/doctors/my-appointments",
        );

        const { data: reportData } = await API.get("/doctors/reports");

        const { data: prescriptionData } = await API.get(
          "/doctors/prescriptions",
        );

        setAppointments(appointmentData);
        setReports(reportData);
        setPrescriptions(prescriptionData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctorData();
  }, []);

  const totalPatients = new Set(
    appointments.map((appointment) => appointment.patient?._id),
  ).size;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;

  const approvedAppointments = appointments.filter(
    (appointment) => appointment.status === "approved",
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  const todayAppointments = appointments.filter(
    (appointment) =>
      appointment.date?.split("T")[0] ===
      new Date().toISOString().split("T")[0],
  ).length;

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="welcome-card">
            <h1>Welcome Back Doctor 👋</h1>
            <p>Manage appointments, reports, prescriptions, and patients.</p>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <FaUserInjured className="stat-icon" />
              <h2>{totalPatients}</h2>
              <p>Total Patients</p>
            </div>

            <div className="stat-card">
              <FaClock className="stat-icon" />
              <h2>{pendingAppointments}</h2>
              <p>Pending Appointments</p>
            </div>

            <div className="stat-card">
              <FaCalendarCheck className="stat-icon" />
              <h2>{approvedAppointments}</h2>
              <p>Approved Appointments</p>
            </div>

            <div className="stat-card">
              <FaFileMedical className="stat-icon" />
              <h2>{reports.length}</h2>
              <p>Total Reports</p>
            </div>

            <div className="stat-card">
              <FaPrescriptionBottleAlt className="stat-icon" />
              <h2>{prescriptions.length}</h2>
              <p>Total Prescriptions</p>
            </div>

            <div className="stat-card">
              <FaCalendarCheck className="stat-icon" />
              <h2>{completedAppointments}</h2>
              <p>Completed Appointments</p>
            </div>

            <div className="stat-card">
              <FaClock className="stat-icon" />
              <h2>{todayAppointments}</h2>
              <p>Today’s Appointments</p>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="dashboard-box">
            <h2>Recent Appointments</h2>

            {appointments.length > 0 ? (
              appointments.slice(0, 5).map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <h3>{appointment.patient?.name}</h3>
                  <p>{appointment.department}</p>
                  <p>{appointment.date?.split("T")[0]}</p>
                  <span>{appointment.status}</span>
                </div>
              ))
            ) : (
              <p>No appointments found.</p>
            )}
          </div>

          {/* Recent Reports */}
          <div className="dashboard-box">
            <h2>Recent Reports</h2>

            {reports.length > 0 ? (
              reports.slice(0, 3).map((report) => (
                <div key={report._id} className="appointment-card">
                  <h3>{report.patient?.name}</h3>
                  <p>{report.title}</p>
                  <p>{report.createdAt?.split("T")[0]}</p>
                </div>
              ))
            ) : (
              <p>No reports found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorHome;
