import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaCalendarCheck, FaSearch, FaCheck, FaTimes } from "react-icons/fa";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const appointmentsPerPage = 5;

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/admin/appointments");
      setAppointments(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAppointments = async () => {
      await fetchAppointments();
    };

    loadAppointments();
  }, []);

  const approveAppointment = async (id) => {
    try {
      await API.put(`/admin/appointments/${id}/approve`);
      toast.success("Appointment approved");
      fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve appointment");
    }
  };

  const rejectAppointment = async (id) => {
    try {
      await API.put(`/admin/appointments/${id}/reject`);
      toast.success("Appointment rejected");
      fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error("Failed to reject appointment");
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      appointment.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      appointment.department?.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;

  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment,
  );

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage,
  );

  if (loading) {
    return (
      <section className="dashboard-layout">
        <AdminSidebar />
        <div className="dashboard-main">
          <AdminNavbar />
          <div className="dashboard-content">
            <p>Loading appointments...</p>
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
          <div className="admin-hero-card">
            <div>
              <h1>All Appointments 📅</h1>
              <p>View, monitor and manage all hospital appointments.</p>
            </div>

            <div className="hero-badge">
              <FaCalendarCheck />
              {appointments.length} Appointments
            </div>
          </div>

          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by patient, doctor or department..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentAppointments.length > 0 ? (
                  currentAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.patient?.name || "N/A"}</td>
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
                        {appointment.status === "pending" ? (
                          <div className="action-buttons">
                            <button
                              className="approve-btn"
                              onClick={() =>
                                approveAppointment(appointment._id)
                              }
                            >
                              <FaCheck /> Approve
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() => rejectAppointment(appointment._id)}
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No appointments available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Appointments;
