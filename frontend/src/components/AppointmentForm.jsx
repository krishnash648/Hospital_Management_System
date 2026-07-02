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
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

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
    "Gynecology",
    "Endocrinology",
  ];

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
      Gynecologist: "Gynecology",
      Gynecology: "Gynecology",
      Pediatrics: "Pediatrics",
      Orthopedics: "Orthopedics",
      Cardiology: "Cardiology",
      Neurology: "Neurology",
      Oncology: "Oncology",
      Radiology: "Radiology",
      "Physical Therapy": "Physical Therapy",
      ENT: "ENT",
      Endocrinologist: "Endocrinology",
    };

    if (specialistMap[specialist]) {
      setDepartment(specialistMap[specialist]);
    }
  }, [specialist]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await API.get("/doctors");
        setDoctors(data);
      } catch {
        toast.error("Failed to load doctors");
      }
    };

    fetchDoctors();
  }, []);

  const normalizeSpecialization = (value) => {
    if (!value) return "";

    const normalized = value.toLowerCase().trim();

    const map = {
      gynecologist: "gynecology",
      gynaecologist: "gynecology",
      gynecology: "gynecology",
      gynaecology: "gynecology",
      orthopedic: "orthopedics",
      orthopaedic: "orthopedics",
      cardiologist: "cardiology",
      neurologist: "neurology",
      dermatologist: "dermatology",
      ent: "ent",
      oncologist: "oncology",
      radiologist: "radiology",
      pediatrician: "pediatrics",
      physiotherapist: "physical therapy",
      endocrinologist: "endocrinology",
      endocrinology: "endocrinology",
    };

    return map[normalized] || normalized;
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      normalizeSpecialization(doctor.specialization) ===
      normalizeSpecialization(department),
  );

  const fetchBookedSlots = async (doctorId, date) => {
    try {
      const { data } = await API.get(
        `/appointments/doctor/${doctorId}/${date}`,
      );
      setBookedSlots(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDoctorChange = (doctorName) => {
    setSelectedDoctorName(doctorName);

    const doctor = doctors.find((doc) => doc.name === doctorName);

    setSelectedDoctor(doctor);
    setAppointmentDate("");
    setAppointmentTime("");
    setBookedSlots([]);
    setAvailableSlots([]);
  };

  const handleDateChange = async (date) => {
    setAppointmentDate(date);
    setAppointmentTime("");

    const selectedAvailability = selectedDoctor?.availability?.find(
      (item) => item.date === date,
    );

    if (!selectedAvailability) {
      toast.error("Doctor not available on selected date");
      setAvailableSlots([]);
      return;
    }

    setAvailableSlots(selectedAvailability.slots);

    if (selectedDoctor) {
      await fetchBookedSlots(selectedDoctor._id, date);
    }
  };

  const handleAppointment = async (e) => {
    e.preventDefault();

    try {
      if (!selectedDoctor) {
        return toast.error("Please select a doctor");
      }

      if (!appointmentTime) {
        return toast.error("Please select a slot");
      }

      const { data } = await API.post("/appointments", {
        doctor: selectedDoctor._id,
        department,
        date: appointmentDate,
        time: appointmentTime,
        notes,
      });

      toast.success(data.message);

      setAppointmentDate("");
      setAppointmentTime("");
      setSelectedDoctor(null);
      setSelectedDoctorName("");
      setNotes("");
      setBookedSlots([]);
      setAvailableSlots([]);
    } catch (error) {
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

          <form onSubmit={handleAppointment}>
            <div className="form-row">
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setSelectedDoctor(null);
                  setSelectedDoctorName("");
                  setAppointmentDate("");
                  setAppointmentTime("");
                }}
              >
                {departmentsArray.map((depart, index) => (
                  <option key={index} value={depart}>
                    {depart}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <select
                value={selectedDoctorName}
                onChange={(e) => handleDoctorChange(e.target.value)}
                required
              >
                <option value="">Select Doctor</option>

                {filteredDoctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.name}>
                    Dr. {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <input
                type="date"
                value={appointmentDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => handleDateChange(e.target.value)}
                required
              />
            </div>

            {availableSlots.length > 0 && (
              <div className="form-row">
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                >
                  <option value="">Select Slot</option>

                  {availableSlots.map((slot, index) => {
                    const isBooked = bookedSlots.includes(slot);

                    return (
                      <option key={index} value={slot} disabled={isBooked}>
                        {slot} {isBooked ? "❌ Booked" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

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
