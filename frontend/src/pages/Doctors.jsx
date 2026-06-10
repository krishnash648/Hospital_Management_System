import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUserDoctor, FaHospital, FaAward } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";

const Doctors = () => {
  const doctors = [
    {
      id: 1,
      name: "Dr. Max Wilson",
      specialization: "Senior Cardiologist",
      department: "Cardiology",
      experience: "20 Years",
      rating: "5.0",
      image: "/doctors/doctor1.png",
    },
    {
      id: 2,
      name: "Dr. Mamta Sharma",
      specialization: "Neurology Specialist",
      department: "Neurology",
      experience: "10 Years",
      rating: "4.8",
      image: "/doctors/doctor2.png",
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      specialization: "Pediatric Consultant",
      department: "Pediatrics",
      experience: "8 Years",
      rating: "4.9",
      image: "/doctors/doctor3.png",
    },
    {
      id: 4,
      name: "Dr. James Anderson",
      specialization: "Orthopedic Surgeon",
      department: "Orthopedics",
      experience: "14 Years",
      rating: "4.8",
      image: "/doctors/doctor4.png",
    },
    {
      id: 5,
      name: "Dr. Olivia Taylor",
      specialization: "Dermatology Expert",
      department: "Dermatology",
      experience: "9 Years",
      rating: "4.9",
      image: "/doctors/doctor5.png",
    },
    {
      id: 6,
      name: "Dr. Sheila Mehta",
      specialization: "Radiology Consultant",
      department: "Radiology",
      experience: "11 Years",
      rating: "4.7",
      image: "/doctors/doctor6.png",
    },
    {
      id: 7,
      name: "Dr. Ashish Kapoor",
      specialization: "ENT Specialist",
      department: "ENT",
      experience: "7 Years",
      rating: "4.8",
      image: "/doctors/doctor7.png",
    },
    {
      id: 8,
      name: "Dr. Pradyuman Sharma",
      specialization: "Gynecology Surgeon",
      department: "Gynecology",
      experience: "13 Years",
      rating: "4.9",
      image: "/doctors/doctor8.png",
    },
    {
      id: 9,
      name: "Dr. Kabir Shah",
      specialization: "Anesthesiologists Expert",
      department: "Anesthesiologists",
      experience: "10 Years",
      rating: "4.8",
      image: "/doctors/doctor9.png",
    },
  ];

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDepartment =
      department === "All" || doctor.department === department;

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
          <option>Cardiology</option>
          <option>Neurology</option>
          <option>Pediatrics</option>
          <option>Orthopedics</option>
          <option>Dermatology</option>
          <option>Radiology</option>
          <option>ENT</option>
          <option>Gynecology</option>
          <option>Anesthesiologists</option>
        </select>
      </section>

      <section className="container doctors-grid">
        {filteredDoctors.map((doctor) => (
          <div className="doctor-card" key={doctor.id}>
            <img src={doctor.image} alt={doctor.name} />

            <div className="doctor-card-content">
              <span>{doctor.department}</span>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization}</p>

              <div className="doctor-meta">
                <div>
                  <FaStar />
                  {doctor.rating}
                </div>

                <div>{doctor.experience}</div>
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
