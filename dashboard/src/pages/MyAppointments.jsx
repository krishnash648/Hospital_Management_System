import Sidebar from "../components/Sidebar";

const MyAppointments = () => {
  const appointments = [
    {
      doctor: "Dr. Sarah Wilson",
      department: "Cardiology",
      date: "18 June 2026",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      doctor: "Dr. Michael Brown",
      department: "Neurology",
      date: "22 June 2026",
      time: "02:00 PM",
      status: "Pending",
    },
    {
      doctor: "Dr. Olivia White",
      department: "Orthopedics",
      date: "25 June 2026",
      time: "11:15 AM",
      status: "Cancelled",
    },
  ];

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>Manage your upcoming and scheduled appointments.</p>
        </div>

        <div className="appointments-table-wrapper">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.doctor}</td>
                  <td>{appointment.department}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>

                  <td>
                    <span
                      className={`appointment-status ${appointment.status.toLowerCase()}`}
                    >
                      {appointment.status}
                    </span>
                  </td>

                  <td>
                    <div className="appointment-btns">
                      <button className="reschedule-btn">Reschedule</button>
                      <button className="cancel-btn">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default MyAppointments;
