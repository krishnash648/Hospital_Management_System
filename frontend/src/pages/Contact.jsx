import { FaLocationDot, FaPhone, FaEnvelope, FaClock } from "react-icons/fa6";

const Contact = () => {
  return (
    <>
      <section className="contact-hero">
        <div className="container contact-hero-content">
          <div>
            <p className="section-tag">CONTACT US</p>

            <h1>Get In Touch With Goldvalley Clinic</h1>

            <p>
              Reach out to our healthcare team for appointments, inquiries, or
              emergency support. We are always here to help.
            </p>
          </div>

          <img src="/contact-banner.png" alt="Contact Us" />
        </div>
      </section>

      <section className="container contact-info-section">
        <div className="contact-card">
          <FaLocationDot />
          <h3>Our Location</h3>
          <p>123 Health Street, Jaipur, Rajasthan</p>
        </div>

        <div className="contact-card">
          <FaPhone />
          <h3>Call Us</h3>
          <p>+91 98765 43210</p>
        </div>

        <div className="contact-card">
          <FaEnvelope />
          <h3>Email Us</h3>
          <p>support@goldvalleyclinic.com</p>
        </div>

        <div className="contact-card">
          <FaClock />
          <h3>Working Hours</h3>
          <p>Mon - Sat : 9:00 AM - 8:00 PM</p>
        </div>
      </section>

      <section className="container contact-form-section">
        <div className="contact-form-wrapper">
          <div className="contact-form-left">
            <p className="section-tag">SEND MESSAGE</p>

            <h2>We’d Love To Hear From You</h2>

            <p>
              Fill out the form below and our team will get back to you as soon
              as possible.
            </p>
          </div>

          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="Full Name" />
              <input type="email" placeholder="Email Address" />
            </div>

            <div className="form-row">
              <input type="text" placeholder="Phone Number" />
              <input type="text" placeholder="Subject" />
            </div>

            <textarea placeholder="Write your message here..." />

            <button type="submit" className="appointment-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="contact-emergency">
        <div className="container emergency-box">
          <h2>Need Immediate Medical Assistance?</h2>

          <p>
            For emergency healthcare services, contact our emergency line
            immediately.
          </p>

          <a href="tel:+919876543210">+91 98765 43210</a>
        </div>
      </section>
    </>
  );
};

export default Contact;
