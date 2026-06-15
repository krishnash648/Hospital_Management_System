import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      department: "Cardiology Patient",
      image: "/testimonials/patient1.png",
      review:
        "The doctors were extremely professional and caring. My treatment experience was smooth and reassuring.",
    },
    {
      id: 2,
      name: "Rahul Verma",
      department: "Orthopedic Patient",
      image: "/testimonials/patient2.png",
      review:
        "Excellent medical staff and advanced facilities. I recovered faster than expected after surgery.",
    },
    {
      id: 3,
      name: "Ananya Gupta",
      department: "Neurology Patient",
      image: "/testimonials/patient3.png",
      review:
        "The consultation process was seamless, and the doctors explained everything clearly.",
    },
    {
      id: 4,
      name: "Rohan Mehta",
      department: "Dermatology Patient",
      image: "/testimonials/patient4.png",
      review:
        "Amazing service and great staff support. The treatment was highly effective and well-managed.",
    },
    {
      id: 5,
      name: "Sneha Kapoor",
      department: "Pediatrics Parent",
      image: "/testimonials/patient5.png",
      review:
        "The pediatric department took excellent care of my child. Very friendly and supportive environment.",
    },
    {
      id: 6,
      name: "Amit Joshi",
      department: "ENT Patient",
      image: "/testimonials/patient6.png",
      review:
        "Quick diagnosis, excellent treatment, and a very comfortable experience overall.",
    },
  ];

  return (
    <>
      <section className="testimonials-hero">
        <div className="container testimonials-hero-content">
          <div>
            <p className="section-tag">PATIENT REVIEWS</p>

            <h1>What Our Patients Say</h1>

            <p>
              Real stories and experiences from patients who trusted Goldvalley
              Clinic for their healthcare journey.
            </p>
          </div>

          <img src="/testimonials-banner.png" alt="Testimonials Banner" />
        </div>
      </section>

      <section className="container testimonials-grid">
        {testimonials.map((testimonial) => (
          <div className="testimonial-card" key={testimonial.id}>
            <img src={testimonial.image} alt={testimonial.name} />

            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <p>{testimonial.review}</p>

            <h3>{testimonial.name}</h3>

            <span>{testimonial.department}</span>
          </div>
        ))}
      </section>

      <section className="testimonial-stats">
        <div className="container stats-grid">
          <div>
            <h2>10k+</h2>
            <p>Happy Patients</p>
          </div>

          <div>
            <h2>98%</h2>
            <p>Satisfaction Rate</p>
          </div>

          <div>
            <h2>50+</h2>
            <p>Expert Doctors</p>
          </div>

          <div>
            <h2>15+</h2>
            <p>Medical Departments</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="testimonial-cta">
        <div className="container">
          <h2>Ready To Experience Quality Healthcare?</h2>

          <p>
            Join thousands of satisfied patients and book your appointment
            today.
          </p>

          <Link to="/appointment" className="cta-btn">
            Book Appointment
          </Link>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
