import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const mockDoctors = [
    {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      doctorDepartment: "Pediatrics",
    },
    {
      _id: "2",
      firstName: "Jane",
      lastName: "Smith",
      doctorDepartment: "Orthopedics",
    },
    {
      _id: "3",
      firstName: "Alice",
      lastName: "Johnson",
      doctorDepartment: "Cardiology",
    },
    {
      _id: "4",
      firstName: "Bob",
      lastName: "Brown",
      doctorDepartment: "Neurology",
    },
    {
      _id: "5",
      firstName: "Chris",
      lastName: "Evans",
      doctorDepartment: "Oncology",
    },
    {
      _id: "6",
      firstName: "Linda",
      lastName: "Taylor",
      doctorDepartment: "Radiology",
    },
    {
      _id: "7",
      firstName: "Emma",
      lastName: "Davis",
      doctorDepartment: "Physical Therapy",
    },
    {
      _id: "8",
      firstName: "George",
      lastName: "Wilson",
      doctorDepartment: "Dermatology",
    },
    {
      _id: "9",
      firstName: "Sophia",
      lastName: "Clark",
      doctorDepartment: "ENT",
    },
    {
      _id: "10",
      firstName: "Max",
      lastName: "Wilson",
      doctorDepartment: "Cardiology",
    },
    {
      _id: "11",
      firstName: "Mamta",
      lastName: "Sharma",
      doctorDepartment: "Neurology",
    },
    {
      _id: "12",
      firstName: "Emily",
      lastName: "Davis",
      doctorDepartment: "Pediatrics",
    },
    {
      _id: "13",
      firstName: "James",
      lastName: "Johnson",
      doctorDepartment: "Orthopedics",
    },
    {
      _id: "14",
      firstName: "Olivia",
      lastName: "Taylor",
      doctorDepartment: "Dermatology",
    },
    {
      _id: "15",
      firstName: "Sheila",
      lastName: "Mehta",
      doctorDepartment: "Radiology",
    },
    {
      _id: "16",
      firstName: "Ashish",
      lastName: "Kapoor",
      doctorDepartment: "ENT",
    },
    {
      _id: "17",
      firstName: "Pradyuman",
      lastName: "Sharma",
      doctorDepartment: "Gynecology",
    },
    {
      _id: "18",
      firstName: "Kabir",
      lastName: "Shah",
      doctorDepartment: "Anesthesiologists",
    },
  ];

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
    "Anesthesiologists",
  ];

  const [doctors] = useState(mockDoctors);

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const hasVisitedBool = Boolean(hasVisited);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          nic,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited: hasVisitedBool,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      toast.success(data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNic("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("");
      setDoctorFirstName("");
      setDoctorLastName("");
      setHasVisited(false);
      setAddress("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="container appointment-section">
      <div className="appointment-wrapper">
        <div className="appointment-image">
          <img src="/appointment-doctor.png" alt="Doctor Consultation" />

          <div className="appointment-features">
            <div className="feature-box">
              <h4>Expert Doctors</h4>
              <p>Board-certified specialists</p>
            </div>

            <div className="feature-box">
              <h4>Quick Booking</h4>
              <p>Appointments in minutes</p>
            </div>

            <div className="feature-box">
              <h4>Secure Care</h4>
              <p>Private & Protected</p>
            </div>
          </div>
        </div>

        <div className="appointment-form-area">
          <p className="section-tag">BOOK APPOINTMENT</p>

          <h2>Schedule Your Visit</h2>

          <p className="form-desc">
            Choose your preferred department and doctor, then select a
            convenient appointment date. Our healthcare team will confirm your
            booking shortly.
          </p>

          <form onSubmit={handleAppointment}>
            <div className="form-row">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="number"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-row">
              <input
                type="number"
                placeholder="Government ID"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
              />

              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="form-row">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>

            <div className="form-row">
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDoctorFirstName("");
                  setDoctorLastName("");
                }}
              >
                {departmentsArray.map((depart, index) => (
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                ))}
              </select>

              <select
                value={`${doctorFirstName} ${doctorLastName}`}
                onChange={(e) => {
                  const [firstName, lastName] = e.target.value.split(" ");

                  setDoctorFirstName(firstName);
                  setDoctorLastName(lastName);
                }}
                disabled={!department}
              >
                <option value="">Select Doctor</option>

                {doctors
                  .filter((doctor) => doctor.doctorDepartment === department)
                  .map((doctor) => (
                    <option
                      value={`${doctor.firstName} ${doctor.lastName}`}
                      key={doctor._id}
                    >
                      Dr. {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
              </select>
            </div>

            <textarea
              rows="5"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your Address"
            />

            <div className="returning-patient">
              <input
                type="checkbox"
                checked={hasVisited}
                onChange={(e) => setHasVisited(e.target.checked)}
              />

              <label>Returning Patient</label>
            </div>

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
