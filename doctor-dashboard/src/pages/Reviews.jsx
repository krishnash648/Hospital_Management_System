import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import { toast } from "react-toastify";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get("/doctors/reviews");

      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadReviews = async () => {
      await fetchReviews();
    };

    loadReviews();
  }, []);

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const submitReply = async (id) => {
    try {
      await API.put(`/doctors/reviews/${id}/reply`, {
        reply: replyText[id],
      });

      toast.success("Reply sent");

      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reply");
    }
  };

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Patient Reviews</h1>
            <p>See what your patients think about your consultations.</p>
          </div>

          {/* Summary Cards */}
          <div className="reviews-summary">
            <div className="review-summary-card">
              <h3>Average Rating</h3>

              <div className="average-stars">
                {renderStars(Math.round(Number(averageRating)))}
              </div>

              <h2>{averageRating} / 5</h2>
            </div>

            <div className="review-summary-card">
              <h3>Total Reviews</h3>

              <h2>{totalReviews}</h2>
            </div>
          </div>

          {/* Reviews */}
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">
              <h3>No Reviews Yet</h3>
              <p>Your patient reviews will appear here.</p>
            </div>
          ) : (
            <div className="reviews-container">
              {reviews.map((review) => (
                <div className="review-card" key={review._id}>
                  <div className="review-top">
                    <h3>{review.patient?.name}</h3>

                    <span className="review-date">
                      {review.feedbackDate?.split("T")[0]}
                    </span>
                  </div>

                  <div className="review-stars">
                    {renderStars(review.rating)}
                  </div>

                  <p className="review-feedback">
                    {review.feedback || "No written feedback."}
                  </p>

                  {review.doctorReply ? (
                    <div className="doctor-reply-box">
                      <h4>Your Reply</h4>
                      <p>{review.doctorReply}</p>
                    </div>
                  ) : (
                    <div className="doctor-reply-form">
                      <textarea
                        className="doctor-reply-textarea"
                        placeholder="Write a reply..."
                        value={replyText[review._id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [review._id]: e.target.value,
                          })
                        }
                      />

                      <button
                        className="doctor-reply-btn"
                        disabled={!replyText[review._id]?.trim()}
                        onClick={() => submitReply(review._id)}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
