import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import { toast } from "react-toastify";

const AppointmentHistory = () => {
  const [historyAppointments, setHistoryAppointments] = useState([]);
  const [activeReview, setActiveReview] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

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
    if (appointment.rating) {
      toast.info("You already reviewed this appointment");
      return;
    }

    setActiveReview(appointment);
    setRating("");
    setComment("");
  };

  const submitReview = async () => {
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please enter rating between 1 and 5");
      return;
    }

    try {
      await API.put(`/appointments/${activeReview._id}/feedback`, {
        rating: Number(rating),
        feedback: comment,
      });

      toast.success("Review submitted");

      setActiveReview(null);
      setRating("");
      setComment("");

      fetchAppointmentHistory();
    } catch (error) {
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
                          appointment.rating ? (
                            <div className="review-display">
                              <div className="review-rating-display">
                                Rated ⭐ {appointment.rating}
                              </div>

                              {appointment.feedback && (
                                <div className="patient-review-box">
                                  <h5>Your Review</h5>
                                  <p>{appointment.feedback}</p>
                                </div>
                              )}

                              {appointment.doctorReply && (
                                <div className="doctor-reply-display">
                                  <h5>Doctor Reply</h5>
                                  <p>{appointment.doctorReply}</p>
                                </div>
                              )}
                            </div>
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

          {activeReview && !activeReview.rating && (
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
