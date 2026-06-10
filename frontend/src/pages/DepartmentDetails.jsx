import React from "react";
import { Link, useParams } from "react-router-dom";

const DepartmentDetails = () => {
  const { department } = useParams();

  const departmentsData = {
    cardiology: {
      title: "Cardiology Department",
      image: "/departments/cardio.png",
      description:
        "Our Cardiology Department provides comprehensive heart care services, including diagnosis, treatment, and prevention of cardiovascular diseases using advanced medical technology.",
      services: [
        "ECG & Echocardiography",
        "Heart Failure Management",
        "Stress Testing",
        "Cardiac Rehabilitation",
        "Preventive Cardiology",
        "Hypertension Treatment",
      ],
      doctors: ["Dr. Sarah Wilson", "Dr. James Carter", "Dr. Emily Johnson"],
    },

    neurology: {
      title: "Neurology Department",
      image: "/departments/neuro.png",
      description:
        "Specialized neurological care for disorders affecting the brain, spinal cord, and nervous system with modern diagnostic and treatment approaches.",
      services: [
        "Stroke Management",
        "Migraine Treatment",
        "Epilepsy Care",
        "Brain Imaging",
        "Neuro Rehabilitation",
        "Nerve Disorder Treatment",
      ],
      doctors: ["Dr. Michael Brown", "Dr. Sophia Davis", "Dr. Daniel Lee"],
    },

    orthopedics: {
      title: "Orthopedics Department",
      image: "/departments/ortho.png",
      description:
        "Providing expert care for bones, joints, muscles, ligaments, and sports injuries to restore mobility and improve quality of life.",
      services: [
        "Joint Replacement",
        "Fracture Care",
        "Sports Injury Treatment",
        "Arthroscopy",
        "Spine Care",
        "Physical Rehabilitation",
      ],
      doctors: ["Dr. James Anderson", "Dr. Olivia White", "Dr. Ethan Clark"],
    },

    pediatrics: {
      title: "Pediatrics Department",
      image: "/departments/pedia.png",
      description:
        "Dedicated healthcare services for infants, children, and adolescents focused on growth, development, and overall wellbeing.",
      services: [
        "Child Health Checkups",
        "Vaccinations",
        "Growth Monitoring",
        "Nutrition Guidance",
        "Pediatric Emergency Care",
        "Newborn Care",
      ],
      doctors: ["Dr. Emily Davis", "Dr. Sophia Martin", "Dr. Noah Wilson"],
    },

    dermatology: {
      title: "Dermatology Department",
      image: "/departments/derma.png",
      description:
        "Comprehensive skin, hair, and nail care using advanced dermatological treatments and cosmetic procedures.",
      services: [
        "Acne Treatment",
        "Skin Allergy Care",
        "Hair Loss Treatment",
        "Laser Procedures",
        "Cosmetic Dermatology",
        "Skin Cancer Screening",
      ],
      doctors: ["Dr. Olivia Taylor", "Dr. Isabella Moore", "Dr. Ava Thompson"],
    },

    radiology: {
      title: "Radiology Department",
      image: "/departments/radio.png",
      description:
        "Advanced imaging and diagnostic services supporting accurate medical evaluations and treatment planning.",
      services: [
        "MRI Scans",
        "CT Scans",
        "Ultrasound",
        "Digital X-Ray",
        "Mammography",
        "Diagnostic Imaging",
      ],
      doctors: ["Dr. Daniel Thomas", "Dr. William Scott", "Dr. Mason Green"],
    },

    ent: {
      title: "ENT Department",
      image: "/departments/ent.png",
      description:
        "Specialized care for conditions affecting the ears, nose, throat, head, and neck with modern treatment solutions.",
      services: [
        "Hearing Evaluation",
        "Sinus Treatment",
        "Tonsil Care",
        "Voice Disorders",
        "Allergy Management",
        "Ear Surgery",
      ],
      doctors: ["Dr. Sophia Martinez", "Dr. Benjamin Hall", "Dr. Lucas King"],
    },
  };

  const currentDepartment = departmentsData[department];

  if (!currentDepartment) {
    return (
      <div className="container" style={{ padding: "100px 0" }}>
        <h2>Department Not Found</h2>
      </div>
    );
  }

  return (
    <section className="department-details-page">
      <div className="container">
        <div className="department-details-hero">
          <div className="department-details-content">
            <p className="section-tag">SPECIALIZED CARE</p>

            <h1>{currentDepartment.title}</h1>

            <p>{currentDepartment.description}</p>

            <Link to="/appointment" className="cta-btn">
              Book Appointment
            </Link>
          </div>

          <div className="department-details-image">
            <img src={currentDepartment.image} alt={currentDepartment.title} />
          </div>
        </div>

        <div className="department-services">
          <h2>Services We Offer</h2>

          <div className="services-grid">
            {currentDepartment.services.map((service, index) => (
              <div className="service-card" key={index}>
                ✓ {service}
              </div>
            ))}
          </div>
        </div>

        <div className="department-doctors">
          <h2>Our Specialists</h2>

          <div className="specialist-grid">
            {currentDepartment.doctors.map((doctor, index) => (
              <div className="specialist-card" key={index}>
                <h4>{doctor}</h4>
                <p>{currentDepartment.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="department-cta">
          <h2>Need Expert Medical Care?</h2>

          <p>
            Schedule an appointment with our experienced specialists and receive
            personalized healthcare services.
          </p>

          <Link to="/appointment" className="cta-btn">
            Schedule Appointment
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DepartmentDetails;
