import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { FaStar, FaUserDoctor, FaHospital, FaAward } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await API.get("/doctors");
        setDoctors(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load doctors");
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDepartment =
      department === "All" || doctor.specialization === department;

    return matchesSearch && matchesDepartment;
  });

  return (
    <>
      <section className="doctors-hero">
        <div className="container doctors-hero-content">
          <div>
            <p className="section-tag">OUR SPECIALISTS</p>

            <h1>Meet Our Experienced Medical Team</h1>

            <p>
              Connect with highly qualified healthcare professionals across
              multiple specialties dedicated to your wellbeing and recovery.
            </p>
          </div>

          <img src="/doctors/doctor-banner.png" alt="Doctors Team" />
        </div>
      </section>

      <section className="container doctor-filter-section">
        <input
          type="text"
          placeholder="Search Doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option>All</option>

          {[...new Set(doctors.map((doc) => doc.specialization))].map(
            (spec, index) => (
              <option key={index}>{spec}</option>
            ),
          )}
        </select>
      </section>

      <section className="container doctors-grid">
        {filteredDoctors.map((doctor) => (
          <div className="doctor-card" key={doctor._id}>
            <img
              src={
                doctor.profileImage
                  ? `http://localhost:5000${doctor.profileImage}`
                  : "/doctors/default-doctor.png"
              }
              alt={doctor.name}
            />

            <div className="doctor-card-content">
              <span>{doctor.specialization}</span>

              <h3>{doctor.name}</h3>

              <p>{doctor.bio || "Experienced healthcare specialist"}</p>

              <div className="doctor-meta">
                <div>
                  <FaStar />
                  4.8
                </div>

                <div>{doctor.experience || 0} Years</div>
              </div>

              <Link to="/appointment" className="doctor-btn">
                Book Appointment
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="doctor-trust-section">
        <div className="container">
          <div className="section-header">
            <p>WHY CHOOSE US</p>
            <h2>Why Patients Trust Our Doctors</h2>
          </div>

          <div className="trust-grid">
            <div className="trust-card">
              <FaUserDoctor />
              <h4>Board Certified Specialists</h4>
            </div>

            <div className="trust-card">
              <FaHospital />
              <h4>Advanced Medical Technology</h4>
            </div>

            <div className="trust-card">
              <FaAward />
              <h4>Years Of Clinical Experience</h4>
            </div>

            <div className="trust-card">
              <FaHeart />
              <h4>Patient-Centered Care</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="doctor-cta">
        <div className="container">
          <h2>Need Medical Assistance?</h2>

          <p>
            Our experienced healthcare professionals are ready to help you
            achieve better health and wellbeing.
          </p>

          <Link to="/appointment" className="cta-btn">
            Book Appointment
          </Link>
        </div>
      </section>
    </>
  );
};

export default Doctors;
