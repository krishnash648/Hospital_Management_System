import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";

const AppointmentHistory = () => {
  const [historyAppointments, setHistoryAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const { data } = await API.get("/appointments/my");

        const filteredHistory = data.filter(
          (appointment) =>
            appointment.status === "approved" ||
            appointment.status === "completed" ||
            appointment.status === "cancelled",
        );

        setHistoryAppointments(filteredHistory);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointmentHistory();
  }, []);

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          <h1>Appointment History</h1>
          <p>View your completed and past consultations.</p>

          <div className="table-wrapper">
            {historyAppointments.length === 0 ? (
              <p>No appointment history found.</p>
            ) : (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Prescription</th>
                    <th>Feedback</th>
                  </tr>
                </thead>

                <tbody>
                  {historyAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.doctor?.name || "N/A"}</td>
                      <td>{appointment.department}</td>
                      <td>{appointment.date?.split("T")[0]}</td>
                      <td>{appointment.time}</td>

                      <td>
                        <span
                          className={`status ${appointment.status.toLowerCase()}`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      <td>
                        <button className="table-btn">View</button>
                      </td>

                      <td>
                        <button className="feedback-btn">Rate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentHistory;
