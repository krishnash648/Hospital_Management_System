import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import { toast } from "react-toastify";

const AppointmentHistory = () => {
  const [historyAppointments, setHistoryAppointments] = useState([]);
  const [reviewedAppointments, setReviewedAppointments] = useState([]);
  const [activeReview, setActiveReview] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      try {
        const { data } = await API.get("/appointments/my");

        const today = new Date();

        const filteredHistory = data.filter((appointment) => {
          const appointmentDate = new Date(appointment.date);

          return (
            appointment.status === "completed" ||
            appointment.status === "cancelled" ||
            appointment.status === "rejected" ||
            appointmentDate < today
          );
        });

        setHistoryAppointments(filteredHistory);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load appointment history");
      }
    };

    fetchAppointmentHistory();
  }, []);

  const handleViewPrescription = () => {
    window.location.href = "/prescriptions";
  };

  const openReviewBox = (appointment) => {
    setActiveReview(appointment);
    setRating("");
    setComment("");
  };

  const submitReview = async () => {
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please enter rating between 1 to 5");
      return;
    }

    try {
      await API.post("/reviews", {
        doctor: activeReview.doctor._id,
        appointment: activeReview._id,
        rating,
        comment,
      });

      toast.success("Review submitted");

      setReviewedAppointments((prev) => [...prev, activeReview._id]);
      setActiveReview(null);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

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
                        <button
                          className="table-btn"
                          onClick={handleViewPrescription}
                        >
                          View
                        </button>
                      </td>

                      <td>
                        {appointment.status === "completed" ? (
                          reviewedAppointments.includes(appointment._id) ? (
                            <span className="review-done">Rated</span>
                          ) : (
                            <button
                              className="feedback-btn"
                              onClick={() => openReviewBox(appointment)}
                            >
                              Rate
                            </button>
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {activeReview && (
            <div className="review-box">
              <h2>Rate Dr. {activeReview.doctor?.name}</h2>

              <input
                className="review-rating"
                type="number"
                min="1"
                max="5"
                placeholder="Rating (1-5)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />

              <textarea
                className="review-textarea"
                placeholder="Write your review..."
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button className="review-submit-btn" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AppointmentHistory;
