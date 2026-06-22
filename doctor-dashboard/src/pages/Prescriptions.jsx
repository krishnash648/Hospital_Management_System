import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import { toast } from "react-toastify";

const Prescriptions = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient: "",
    medicineName: "",
    dosage: "",
    duration: "",
    notes: "",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await API.get("/doctors/my-appointments");

        const uniquePatients = [];
        const patientIds = new Set();

        data.forEach((appointment) => {
          if (appointment.patient && !patientIds.has(appointment.patient._id)) {
            patientIds.add(appointment.patient._id);
            uniquePatients.push(appointment.patient);
          }
        });

        setPatients(uniquePatients);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load patients");
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/doctors/prescriptions", formData);

      toast.success("Prescription created");

      setFormData({
        patient: "",
        medicineName: "",
        dosage: "",
        duration: "",
        notes: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to create prescription");
    }
  };

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Create Prescription</h1>
            <p>Add prescriptions for your patients.</p>
          </div>

          <div className="settings-card">
            <form className="settings-form" onSubmit={handleSubmit}>
              <select
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                required
              >
                <option value="">Select Patient</option>

                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="medicineName"
                placeholder="Medicine Name"
                value={formData.medicineName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="dosage"
                placeholder="Dosage"
                value={formData.dosage}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={formData.duration}
                onChange={handleChange}
                required
              />

              <textarea
                name="notes"
                placeholder="Additional Notes"
                value={formData.notes}
                onChange={handleChange}
                rows="5"
              />

              <button type="submit" className="save-btn">
                Save Prescription
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prescriptions;
