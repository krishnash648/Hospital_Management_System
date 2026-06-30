import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const Prescriptions = () => {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    patient: "",
    medicineName: "",
    dosage: "",
    duration: "",
    notes: "",
  });

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

  const fetchPrescriptions = async () => {
    try {
      const { data } = await API.get("/doctors/prescriptions");
      setPrescriptions(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load prescriptions");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchPatients();
      await fetchPrescriptions();
    };

    loadData();
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
      if (editingId) {
        await API.put(`/doctors/prescriptions/${editingId}`, formData);
        toast.success("Prescription updated");
      } else {
        await API.post("/doctors/prescriptions", formData);
        toast.success("Prescription created");
      }

      setFormData({
        patient: "",
        medicineName: "",
        dosage: "",
        duration: "",
        notes: "",
      });

      setEditingId(null);
      fetchPrescriptions();
    } catch (error) {
      console.log(error);
      toast.error("Failed to save prescription");
    }
  };

  const handleEdit = (prescription) => {
    setEditingId(prescription._id);

    setFormData({
      patient: prescription.patient?._id || "",
      medicineName: prescription.medicineName,
      dosage: prescription.dosage,
      duration: prescription.duration,
      notes: prescription.notes,
    });
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/doctors/prescriptions/${id}`);
      toast.success("Prescription deleted");
      fetchPrescriptions();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete prescription");
    }
  };

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Prescriptions</h1>
            <p>Create and manage patient prescriptions.</p>
          </div>

          {/* Form */}
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
                {editingId ? "Update Prescription" : "Save Prescription"}
              </button>
            </form>
          </div>

          {/* Existing Prescriptions */}
          <div className="reports-grid">
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <div key={prescription._id} className="report-card">
                  <h3>{prescription.medicineName}</h3>

                  <p>
                    <strong>Patient:</strong> {prescription.patient?.name}
                  </p>

                  <p>
                    <strong>Dosage:</strong> {prescription.dosage}
                  </p>

                  <p>
                    <strong>Duration:</strong> {prescription.duration}
                  </p>

                  <p>
                    <strong>Notes:</strong> {prescription.notes || "No notes"}
                  </p>

                  <div className="report-actions">
                    <button
                      className="view-btn"
                      onClick={() => handleEdit(prescription)}
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      className="download-btn"
                      onClick={() => handleDelete(prescription._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No prescriptions found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prescriptions;
