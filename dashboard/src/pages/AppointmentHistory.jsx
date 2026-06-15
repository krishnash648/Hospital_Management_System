import Sidebar from "../components/Sidebar";

const AppointmentHistory = () => {
  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <h1>Appointment History</h1>
        <p>View your completed and past consultations.</p>

        <div className="table-wrapper">
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
              <tr>
                <td>Dr. Sarah Wilson</td>
                <td>Cardiology</td>
                <td>10 June 2026</td>
                <td>11:00 AM</td>
                <td>
                  <span className="status completed">Completed</span>
                </td>
                <td>
                  <button className="table-btn">View</button>
                </td>
                <td>
                  <button className="feedback-btn">Rate</button>
                </td>
              </tr>

              <tr>
                <td>Dr. Michael Brown</td>
                <td>Neurology</td>
                <td>05 June 2026</td>
                <td>03:00 PM</td>
                <td>
                  <span className="status cancelled">Cancelled</span>
                </td>
                <td>
                  <button className="table-btn">View</button>
                </td>
                <td>
                  <button className="feedback-btn">Rate</button>
                </td>
              </tr>

              <tr>
                <td>Dr. Olivia White</td>
                <td>Orthopedics</td>
                <td>01 June 2026</td>
                <td>09:30 AM</td>
                <td>
                  <span className="status missed">Missed</span>
                </td>
                <td>
                  <button className="table-btn">View</button>
                </td>
                <td>
                  <button className="feedback-btn">Rate</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AppointmentHistory;
