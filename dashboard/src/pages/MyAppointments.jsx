import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await API.get("/appointments/my");

      if (Array.isArray(res.data)) {
        setAppointments(res.data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch appointments");
    }
  }, []);

  const cancelAppointment = async (id) => {
    try {
      await API.delete(`/appointments/${id}`);
      toast.success("Appointment cancelled");

      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== id),
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel appointment");
    }
  };

  useEffect(() => {
    const loadAppointments = async () => {
      await fetchAppointments();
    };

    loadAppointments();
  }, [fetchAppointments]);

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>My Appointments</h1>
            <p>Manage your upcoming and scheduled appointments.</p>
          </div>

          <div className="appointments-table-wrapper">
            {appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.doctor?.name || "N/A"}</td>
                      <td>{appointment.department}</td>
                      <td>{appointment.date?.split("T")[0]}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.status}</td>
                      <td>{appointment.notes || "No notes"}</td>
                      <td>
                        <button
                          className="cancel-btn"
                          onClick={() => cancelAppointment(appointment._id)}
                        >
                          Cancel
                        </button>
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

export default MyAppointments;
