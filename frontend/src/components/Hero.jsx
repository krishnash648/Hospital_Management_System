import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Hero = ({ imageUrl }) => {
  return (
    <section className="hero container">
      {" "}
      <div className="banner">
        {" "}
        <span className="hero-tag">Trusted Healthcare Platform</span>
        <h1>
          Your Health,
          <br />
          Our Priority
        </h1>
        <p>
          Experience world-class healthcare with expert doctors, seamless
          appointment scheduling, and personalized patient care.
        </p>
        <div className="hero-buttons">
          <Link to="/appointment" className="primary-btn">
            Book Appointment
          </Link>

          <Link to="/doctors" className="secondary-btn">
            Find Doctors
          </Link>

          <Link to="/departments" className="third-btn">
            Explore Departments
          </Link>
        </div>
        <div className="hero-stats">
          <div>
            <h3>50+</h3>
            <span>Doctors</span>
          </div>

          <div>
            <h3>10k+</h3>
            <span>Patients</span>
          </div>

          <div>
            <h3>24/7</h3>
            <span>Support</span>
          </div>
          <div>
            <h3>15+</h3>
            <span>Departments</span>
          </div>
        </div>
      </div>
      <div className="banner">
        <img src={imageUrl} alt="doctor" className="hero-image" />
      </div>
    </section>
  );
};

Hero.propTypes = {
  imageUrl: PropTypes.string.isRequired,
};

export default Hero;
