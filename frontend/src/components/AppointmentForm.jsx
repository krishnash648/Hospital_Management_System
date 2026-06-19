import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

const AppointmentForm = () => {
  const [searchParams] = useSearchParams();
  const specialist = searchParams.get("specialist");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [department, setDepartment] = useState("Cardiology");
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  const [notes, setNotes] = useState("");
  const [doctors, setDoctors] = useState([]);

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  // Auto-select department from AI recommendation
  useEffect(() => {
    if (!specialist) return;

    const specialistMap = {
      Neurologist: "Neurology",
      Cardiologist: "Cardiology",
      Pulmonologist: "Radiology",
      Dermatologist: "Dermatology",
      Gastroenterologist: "Oncology",
      Orthopedic: "Orthopedics",
      "General Physician": "Pediatrics",
    };

    if (specialistMap[specialist]) {
      setDepartment(specialistMap[specialist]);
    }
  }, [specialist]);

  // Fetch doctors
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

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.specialization === department,
  );

  const handleAppointment = async (e) => {
    e.preventDefault();

    try {
      const selectedDoctor = doctors.find(
        (doc) => doc.name === selectedDoctorName,
      );

      if (!selectedDoctor) {
        return toast.error("Please select a doctor");
      }

      const { data } = await API.post("/appointments", {
        doctor: selectedDoctor._id,
        department,
        date: appointmentDate,
        time: appointmentTime,
        notes,
      });

      toast.success(data.message || "Appointment booked successfully");

      setAppointmentDate("");
      setAppointmentTime("");
      setDepartment("Cardiology");
      setSelectedDoctorName("");
      setNotes("");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <section className="container appointment-section">
      <div className="appointment-wrapper">
        <div className="appointment-image">
          <img src="/appointment-doctor.png" alt="Doctor Consultation" />
        </div>

        <div className="appointment-form-area">
          <p className="section-tag">BOOK APPOINTMENT</p>

          <h2>Schedule Your Visit</h2>

          {specialist && (
            <p>
              Recommended Specialist: <strong>{specialist}</strong>
            </p>
          )}

          <form onSubmit={handleAppointment}>
            <div className="form-row">
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />

              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setSelectedDoctorName("");
                }}
              >
                {departmentsArray.map((depart, index) => (
                  <option key={index} value={depart}>
                    {depart}
                  </option>
                ))}
              </select>

              <select
                value={selectedDoctorName}
                onChange={(e) => setSelectedDoctorName(e.target.value)}
                required
              >
                <option value="">Select Doctor</option>

                {filteredDoctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.name}>
                    Dr. {doctor.name}
                  </option>
                ))}

                {filteredDoctors.length === 0 && (
                  <option disabled>No doctors available</option>
                )}
              </select>
            </div>

            <textarea
              rows="5"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional Notes"
            />

            <button type="submit" className="appointment-btn">
              Confirm Appointment
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
