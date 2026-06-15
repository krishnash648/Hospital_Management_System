import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "How can I book an appointment?",
      answer:
        "You can book an appointment directly through our website by visiting the appointment page and selecting your preferred doctor and date.",
    },
    {
      question: "Do you accept emergency walk-ins?",
      answer:
        "Yes, we provide emergency medical care 24/7 for urgent cases and immediate treatments.",
    },
    {
      question: "Are online consultations available?",
      answer:
        "Yes, we offer online consultations for selected departments and follow-up appointments.",
    },
    {
      question: "What insurance plans do you accept?",
      answer:
        "We accept most major health insurance providers. Please contact our support team for exact details.",
    },
    {
      question: "How do I access my medical reports?",
      answer:
        "Patients can collect reports physically or access them digitally through our patient portal.",
    },
    {
      question: "Can I reschedule my appointment?",
      answer:
        "Yes, appointments can be rescheduled from your dashboard or by contacting our support team.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {/* HERO */}
      <section className="faq-hero">
        <div className="container faq-hero-content">
          <div>
            <p className="section-tag">FREQUENTLY ASKED QUESTIONS</p>

            <h1>Everything You Need To Know</h1>

            <p>
              Find answers to common questions about appointments, treatments,
              consultations, and patient services.
            </p>
          </div>

          <img src="/faq-banner.png" alt="FAQ Banner" />
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="container faq-section">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${activeIndex === index ? "active-faq" : ""}`}
            key={index}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h3>{faq.question}</h3>

              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="faq-cta">
        <div className="container">
          <h2>Still Have Questions?</h2>

          <p>
            Our support team is here to help you with any healthcare-related
            concerns.
          </p>

          <Link to="/contact" className="cta-btn">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
};

export default FAQ;
