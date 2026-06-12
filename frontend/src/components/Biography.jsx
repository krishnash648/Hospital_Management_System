import { FaCheckCircle } from "react-icons/fa";
import PropTypes from "prop-types";

const Biography = ({ imageUrl }) => {
  return (
    <section className="biography container">
      <div className="bio-image">
        <img src={imageUrl} alt="Healthcare Team" />
      </div>

      <div className="bio-content">
        <span className="section-tag">ABOUT US</span>

        <h2>
          Delivering Exceptional Healthcare Experiences <br />
        </h2>

        <p className="bio-text">
          We provide patient-centered healthcare through experienced medical
          professionals, advanced facilities, and modern technology. Our goal is
          to make quality healthcare accessible, efficient, and reliable for
          everyone.
        </p>

        <div className="bio-features">
          <div>
            <FaCheckCircle />
            <span>24/7 Emergency Support</span>
          </div>

          <div>
            <FaCheckCircle />
            <span>Expert Medical Specialists</span>
          </div>

          <div>
            <FaCheckCircle />
            <span>Modern Medical Equipment</span>
          </div>

          <div>
            <FaCheckCircle />
            <span>Online Appointment Booking</span>
          </div>
        </div>

        <div className="bio-stats">
          <div>
            <h3>50+</h3>
            <p>Doctors</p>
          </div>

          <div>
            <h3>10k+</h3>
            <p>Patients</p>
          </div>

          <div>
            <h3>15+</h3>
            <p>Departments</p>
          </div>
        </div>
      </div>
    </section>
  );
};

Biography.propTypes = {
  imageUrl: PropTypes.string.isRequired,
};

export default Biography;
