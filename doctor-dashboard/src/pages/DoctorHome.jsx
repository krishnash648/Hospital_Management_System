import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaClock,
  FaFileMedical,
} from "react-icons/fa";

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const { data: appointmentData } = await API.get(
          "/doctors/my-appointments",
        );

        const { data: reportData } = await API.get("/doctors/reports");

        setAppointments(appointmentData);
        setReports(reportData);
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

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="welcome-card">
            <h1>Welcome Back Doc!👋</h1>
            <p>Manage appointments, patients, reports, and prescriptions.</p>
          </div>

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
          </div>

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
        </div>
      </div>
    </section>
  );
};

export default DoctorHome;
