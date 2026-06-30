import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import { toast } from "react-toastify";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Refresh appointments after action
  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/doctors/my-appointments");
      setAppointments(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load appointments");
    }
  };

  // Initial load (separate to avoid React warning)
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const { data } = await API.get("/doctors/my-appointments");
        setAppointments(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load appointments");
      }
    };

    loadAppointments();
  }, []);

  const approveAppointment = async (id) => {
    try {
      await API.put(`/doctors/appointments/${id}/approve`);

      toast.success("Appointment approved");
      fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve appointment");
    }
  };

  const rejectAppointment = async (id) => {
    try {
      await API.put(`/doctors/appointments/${id}/reject`);

      toast.success("Appointment rejected");
      fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error("Failed to reject appointment");
    }
  };

  const completeAppointment = async (id) => {
    try {
      await API.put(`/doctors/appointments/${id}/complete`);

      toast.success("Appointment marked completed");
      fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to complete appointment",
      );
    }
  };

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Appointments</h1>
            <p>Manage your patient appointments here.</p>
          </div>

          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.patient?.name}</td>
                      <td>{appointment.patient?.email}</td>
                      <td>{appointment.department}</td>
                      <td>{appointment.date?.split("T")[0]}</td>
                      <td>{appointment.time}</td>

                      <td>
                        <span
                          className={`appointment-status ${appointment.status}`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      <td>
                        {/* Pending */}
                        {appointment.status === "pending" && (
                          <div className="appointment-btns">
                            <button
                              className="table-btn"
                              onClick={() =>
                                approveAppointment(appointment._id)
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="feedback-btn"
                              onClick={() => rejectAppointment(appointment._id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {/* Approved */}
                        {appointment.status === "approved" && (
                          <button
                            className="table-btn"
                            onClick={() => completeAppointment(appointment._id)}
                          >
                            Mark Complete
                          </button>
                        )}

                        {/* Finished */}
                        {["completed", "rejected", "cancelled"].includes(
                          appointment.status,
                        ) && "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorAppointments;
