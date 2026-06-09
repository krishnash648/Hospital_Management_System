import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="modern-footer">
      {" "}
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/logo.png" alt="logo" className="logo-img" />

          <p>
            Delivering trusted healthcare through experienced specialists,
            advanced technology, and compassionate patient care.
          </p>

          <div className="footer-socials">
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/appointment">Appointments</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Departments</h4>

          <ul>
            <li>Cardiology</li>
            <li>Neurology</li>
            <li>Orthopedics</li>
            <li>Pediatrics</li>
            <li>Dermatology</li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>

          <div className="footer-contact">
            <FaPhoneAlt />
            <span>+91 96644 80918</span>
          </div>

          <div className="footer-contact">
            <MdEmail />
            <span>contact@goldvalleyclinic.com</span>
          </div>

          <div className="footer-contact">
            <FaLocationDot />
            <span>Jaipur, Rajasthan, India</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Goldvalley Clinic. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
