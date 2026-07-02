import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import { toast } from "react-toastify";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/doctors/my-appointments");
      setAppointments(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load appointments");
    }
  };

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

  const approveAppointment = async () => {
    if (!meetingLink) {
      return toast.error("Meeting link is required");
    }

    try {
      await API.put(`/doctors/appointments/${selectedAppointment}/approve`, {
        meetingLink,
      });

      toast.success("Appointment approved");

      setSelectedAppointment(null);
      setMeetingLink("");

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
                        {appointment.status === "pending" && (
                          <div className="appointment-btns">
                            <button
                              className="table-btn"
                              onClick={() =>
                                setSelectedAppointment(appointment._id)
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

                        {appointment.status === "approved" && (
                          <div className="appointment-btns">
                            <button
                              className="table-btn"
                              onClick={() =>
                                appointment.meetingLink &&
                                window.open(appointment.meetingLink, "_blank")
                              }
                            >
                              Start Meet
                            </button>

                            <button
                              className="feedback-btn"
                              onClick={() =>
                                completeAppointment(appointment._id)
                              }
                            >
                              Mark Complete
                            </button>
                          </div>
                        )}

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

      {selectedAppointment && (
        <div className="meeting-modal">
          <div className="meeting-card">
            <h2 className="meeting-title">Add Google Meet Link</h2>

            <input
              type="text"
              className="meeting-input"
              placeholder="Paste Google Meet link here..."
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />

            <div className="meeting-actions">
              <button className="meeting-save-btn" onClick={approveAppointment}>
                Save & Approve
              </button>

              <button
                className="meeting-close-btn"
                onClick={() => {
                  setSelectedAppointment(null);
                  setMeetingLink("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DoctorAppointments;
