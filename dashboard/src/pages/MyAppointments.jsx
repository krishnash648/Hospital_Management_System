import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = useCallback(async () => {
    try {
      const { data } = await API.get("/appointments/my");

      if (Array.isArray(data)) {
        setAppointments(data);
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
        prev.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "cancelled" }
            : appointment,
        ),
      );
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment",
      );
    }
  };

  useEffect(() => {
    const loadAppointments = async () => {
      await fetchAppointments();
    };

    loadAppointments();
  }, [fetchAppointments]);

  const today = new Date();

  const upcomingAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(`${appointment.date}`);

    return (
      ["pending", "approved"].includes(appointment.status) &&
      appointmentDate >= today
    );
  });

  const renderTable = (data, showCancel = false) => (
    <table className="appointments-table">
      <thead>
        <tr>
          <th>Doctor</th>
          <th>Department</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          <th>Notes</th>
          {showCancel && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {data.map((appointment) => (
          <tr key={appointment._id}>
            <td>{appointment.doctor?.name || "N/A"}</td>
            <td>{appointment.department}</td>
            <td>{appointment.date?.split("T")[0]}</td>
            <td>{appointment.time}</td>
            <td>{appointment.status}</td>
            <td>{appointment.notes || "No notes"}</td>

            {showCancel && (
              <td>
                <button
                  className="cancel-btn"
                  onClick={() => cancelAppointment(appointment._id)}
                >
                  Cancel
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>My Appointments</h1>
            <p>Track your upcoming and past appointments.</p>
          </div>

          {/* Upcoming */}
          <div className="appointments-table-wrapper">
            <h2>Upcoming Appointments</h2>

            {upcomingAppointments.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              renderTable(upcomingAppointments, true)
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAppointments;
