import Review from "../models/Review.js";

// Create review
export const createReview = async (req, res) => {
  try {
    const { doctor, appointment, rating, comment } = req.body;

    // prevent duplicate review for same appointment
    const existingReview = await Review.findOne({
      patient: req.user._id,
      appointment,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this appointment",
      });
    }

    const review = await Review.create({
      patient: req.user._id,
      doctor,
      appointment,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get doctor reviews
export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      doctor: req.params.id,
    })
      .populate("patient", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
