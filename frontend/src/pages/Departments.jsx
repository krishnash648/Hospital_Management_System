import { Link } from "react-router-dom";
import {
  FaHeart,
  FaBrain,
  FaBone,
  FaChild,
  FaRibbon,
  FaXRay,
  FaPersonWalking,
  FaHandSparkles,
  FaEarListen,
} from "react-icons/fa6";

const Departments = () => {
  const departments = [
    {
      icon: <FaHeart />,
      name: "Cardiology",
      description:
        "Advanced diagnosis and treatment for heart and cardiovascular conditions.",
      doctors: "8 Specialists",
    },
    {
      icon: <FaBrain />,
      name: "Neurology",
      description:
        "Expert care for brain, spinal cord, and nervous system disorders.",
      doctors: "6 Specialists",
    },
    {
      icon: <FaBone />,
      name: "Orthopedics",
      description:
        "Comprehensive treatment for bones, joints, muscles, and injuries.",
      doctors: "10 Specialists",
    },
    {
      icon: <FaChild />,
      name: "Pediatrics",
      description:
        "Dedicated healthcare services for infants, children, and adolescents.",
      doctors: "7 Specialists",
    },
    {
      icon: <FaRibbon />,
      name: "Oncology",
      description:
        "Personalized cancer diagnosis, treatment, and patient support.",
      doctors: "5 Specialists",
    },
    {
      icon: <FaXRay />,
      name: "Radiology",
      description:
        "State-of-the-art imaging and diagnostic healthcare solutions.",
      doctors: "4 Specialists",
    },
    {
      icon: <FaPersonWalking />,
      name: "Physical Therapy",
      description: "Rehabilitation programs focused on mobility and recovery.",
      doctors: "5 Specialists",
    },
    {
      icon: <FaHandSparkles />,
      name: "Dermatology",
      description:
        "Treatment for skin, hair, and nail conditions with modern care.",
      doctors: "4 Specialists",
    },
    {
      icon: <FaEarListen />,
      name: "ENT",
      description:
        "Specialized care for ear, nose, throat, and hearing disorders.",
      doctors: "6 Specialists",
    },
  ];

  return (
    <>
      <section className="departments-hero">
        <div className="container departments-hero-content">
          <div>
            <p className="section-tag">OUR DEPARTMENTS</p>

            <h1>Comprehensive Healthcare Services</h1>

            <p>
              Explore our specialized medical departments staffed by experienced
              healthcare professionals and equipped with modern technology for
              exceptional patient care.
            </p>
          </div>

          <img src="/departments-banner.png" alt="Medical Departments" />
        </div>
      </section>

      <section className="container departments-grid-section">
        <div className="section-header">
          <p>SPECIALIZED CARE</p>
          <h2>Our Medical Departments</h2>
        </div>

        <div className="departments-grid">
          {departments.map((department, index) => (
            <div className="department-card" key={index}>
              <div className="department-icon">{department.icon}</div>

              <h3>{department.name}</h3>

              <p>{department.description}</p>

              <span>{department.doctors}</span>

              <Link
                to={`/departments/${department.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="department-btn"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="department-stats">
        <div className="container stats-grid">
          <div className="stat-card">
            <h2>50+</h2>
            <p>Experienced Doctors</p>
          </div>

          <div className="stat-card">
            <h2>15+</h2>
            <p>Medical Departments</p>
          </div>

          <div className="stat-card">
            <h2>10K+</h2>
            <p>Happy Patients</p>
          </div>

          <div className="stat-card">
            <h2>24/7</h2>
            <p>Emergency Support</p>
          </div>
        </div>
      </section>

      <section className="department-benefits">
        <div className="container">
          <div className="section-header">
            <p>WHY CHOOSE US</p>
            <h2>Healthcare Excellence You Can Trust</h2>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <h4>Experienced Specialists</h4>
              <p>Board-certified doctors with years of clinical expertise.</p>
            </div>

            <div className="benefit-card">
              <h4>Advanced Equipment</h4>
              <p>
                Modern diagnostic and treatment technologies for better care.
              </p>
            </div>

            <div className="benefit-card">
              <h4>Personalized Treatment</h4>
              <p>
                Tailored healthcare solutions designed around patient needs.
              </p>
            </div>

            <div className="benefit-card">
              <h4>24/7 Emergency Care</h4>
              <p>Round-the-clock healthcare support whenever you need it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="departments-cta">
        <div className="container">
          <h2>Need Help Choosing a Department?</h2>

          <p>
            Our healthcare professionals are ready to guide you to the right
            specialist and treatment plan.
          </p>

          <Link to="/appointment" className="cta-btn">
            Book Appointment
          </Link>
        </div>
      </section>
    </>
  );
};

export default Departments;
