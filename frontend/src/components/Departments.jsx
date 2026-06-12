import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

const Departments = () => {
  const departmentsArray = [
    {
      name: "Cardiology",
      imageUrl: "/departments/cardio.png",
      description: "Heart and cardiovascular care.",
    },
    {
      name: "Neurology",
      imageUrl: "/departments/neuro.png",
      description: "Brain and nervous system specialists.",
    },
    {
      name: "Orthopedics",
      imageUrl: "/departments/ortho.png",
      description: "Joint, bone and mobility treatments.",
    },
    {
      name: "Pediatrics",
      imageUrl: "/departments/pedia.png",
      description: "Healthcare for children and infants.",
    },
    {
      name: "Dermatology",
      imageUrl: "/departments/derma.png",
      description: "Skin and cosmetic treatments.",
    },
    {
      name: "Radiology",
      imageUrl: "/departments/radio.png",
      description: "Advanced medical imaging services.",
    },
    {
      name: "ENT",
      imageUrl: "/departments/ent.png",
      description: "Ear, Nose, and Throat treatments.",
    },
    {
      name: "Oncology",
      imageUrl: "/departments/oncology.png",
      description: "Cancer treatment and management.",
    },
    {
      name: "Physical Therapy",
      imageUrl: "/departments/physical.png",
      description: "Rehabilitation and movement therapy.",
    },
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="departments container">
      <div className="section-header">
        <p>OUR SERVICES</p>
        <h2>Healthcare Specialties</h2>
        <span className="section-desc">
          Specialized healthcare services delivered by experienced
          professionals.
        </span>
      </div>

      <div className="departments-carousel">
        <Carousel responsive={responsive}>
          {departmentsArray.map((department, index) => (
            <div className="card" key={index}>
              <img src={department.imageUrl} alt={department.name} />

              <div className="card-content">
                <h3>{department.name}</h3>

                <p>{department.description}</p>

                <Link
                  to={`/departments/${department.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="learn-more-btn"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Departments;
