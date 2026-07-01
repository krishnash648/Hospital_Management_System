import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [invoice, setInvoice] = useState(null);

  const fetchAppointments = async () => {
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
  };

  const cancelAppointment = async (id) => {
    try {
      await API.put(`/appointments/${id}/cancel`);

      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment",
      );
    }
  };

  const payAppointment = async (id) => {
    try {
      const { data } = await API.put(`/appointments/${id}/pay`);
      window.open(data.url, "_self");
    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
    }
  };

  const viewInvoice = async (id) => {
    try {
      const { data } = await API.get(`/appointments/${id}/invoice`);
      setInvoice(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch invoice");
    }
  };

  useEffect(() => {
    const loadAppointments = async () => {
      await fetchAppointments();
    };

    loadAppointments();
  }, []);

  const today = new Date();

  const upcomingAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);

    return (
      ["pending", "approved"].includes(appointment.status) &&
      appointmentDate >= today
    );
  });

  const renderTable = (data, showActions = false) => (
    <table className="appointments-table">
      <thead>
        <tr>
          <th>Doctor</th>
          <th>Department</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          <th>Payment</th>
          <th>Notes</th>
          {showActions && <th>Actions</th>}
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

            <td>
              <span className={appointment.paymentStatus}>
                {appointment.paymentStatus}
              </span>
            </td>

            <td>{appointment.notes || "No notes"}</td>

            {showActions && (
              <td>
                <div className="action-buttons">
                  {appointment.paymentStatus === "pending" && (
                    <button
                      className="pay-btn"
                      onClick={() => payAppointment(appointment._id)}
                    >
                      Pay Now
                    </button>
                  )}

                  {appointment.paymentStatus === "paid" && (
                    <button
                      className="view-btn"
                      onClick={() => viewInvoice(appointment._id)}
                    >
                      View Invoice
                    </button>
                  )}

                  <button
                    className="cancel-btn"
                    onClick={() => cancelAppointment(appointment._id)}
                  >
                    Cancel
                  </button>
                </div>
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
            <p>Track your upcoming and paid appointments.</p>
          </div>

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

      {invoice && (
        <div className="invoice-modal">
          <div className="invoice-card">
            <h2>Invoice Details</h2>

            <p>
              <strong>Invoice Number:</strong> {invoice.invoiceNumber}
            </p>

            <p>
              <strong>Doctor:</strong> {invoice.doctor}
            </p>

            <p>
              <strong>Specialization:</strong> {invoice.specialization}
            </p>

            <p>
              <strong>Amount:</strong> ₹{invoice.amount}
            </p>

            <p>
              <strong>Status:</strong> {invoice.paymentStatus}
            </p>

            <p>
              <strong>Transaction ID:</strong> {invoice.transactionId}
            </p>

            <p>
              <strong>Date:</strong> {invoice.date?.split("T")[0]}
            </p>

            <p>
              <strong>Time:</strong> {invoice.time}
            </p>

            <button className="cancel-btn" onClick={() => setInvoice(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyAppointments;
