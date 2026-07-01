import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaUserMd, FaTrash, FaSearch, FaPlus, FaEdit } from "react-icons/fa";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const doctorsPerPage = 5;

  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    experience: "",
    fees: "",
    bio: "",
    profileImage: null,
  };

  const [doctorForm, setDoctorForm] = useState(initialFormState);

  const fetchDoctors = async () => {
    try {
      const { data } = await API.get("/admin/doctors");
      setDoctors(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDoctors = async () => {
      await fetchDoctors();
    };

    loadDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];

      setDoctorForm({
        ...doctorForm,
        profileImage: file,
      });

      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setDoctorForm({
        ...doctorForm,
        [name]: value,
      });
    }
  };

  const resetForm = () => {
    setDoctorForm(initialFormState);
    setEditingDoctorId(null);
    setPreviewImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(doctorForm).forEach((key) => {
        if (doctorForm[key] !== null) {
          formData.append(key, doctorForm[key]);
        }
      });

      if (editingDoctorId) {
        await API.put(`/admin/doctor/${editingDoctorId}`, formData);
        toast.success("Doctor updated successfully");
      } else {
        await API.post("/admin/doctor", formData);
        toast.success("Doctor added successfully");
      }

      resetForm();
      fetchDoctors();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const editDoctor = (doctor) => {
    setEditingDoctorId(doctor._id);

    setDoctorForm({
      name: doctor.name || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      password: "",
      specialization: doctor.specialization || "",
      experience: doctor.experience || "",
      fees: doctor.fees || "",
      bio: doctor.bio || "",
      profileImage: null,
    });

    setPreviewImage(
      doctor.profileImage ? `http://localhost:5000${doctor.profileImage}` : "",
    );
  };

  const deleteDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/user/${id}`);
      toast.success("Doctor deleted successfully");
      fetchDoctors();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete doctor");
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;

  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor,
  );

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  if (loading) {
    return (
      <section className="dashboard-layout">
        <AdminSidebar />
        <div className="dashboard-main">
          <AdminNavbar />
          <div className="dashboard-content">
            <p>Loading doctors...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-layout">
      <AdminSidebar />

      <div className="dashboard-main">
        <AdminNavbar />

        <div className="dashboard-content">
          <div className="admin-hero-card">
            <div>
              <h1>Manage Doctors 👨‍⚕️</h1>
              <p>View, add, edit and manage all doctors.</p>
            </div>

            <div className="hero-badge">
              <FaUserMd />
              {doctors.length} Doctors
            </div>
          </div>

          <div className="settings-card">
            <h3>
              <FaPlus /> {editingDoctorId ? "Edit Doctor" : "Add New Doctor"}
            </h3>

            <form className="doctor-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Doctor Name"
                value={doctorForm.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={doctorForm.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={doctorForm.phone}
                onChange={handleChange}
                required
              />

              {!editingDoctorId && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={doctorForm.password}
                  onChange={handleChange}
                  required
                />
              )}

              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={doctorForm.specialization}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience (years)"
                value={doctorForm.experience}
                onChange={handleChange}
              />

              <input
                type="number"
                name="fees"
                placeholder="Consultation Fees"
                value={doctorForm.fees}
                onChange={handleChange}
              />

              <textarea
                name="bio"
                placeholder="Doctor Bio"
                value={doctorForm.bio}
                onChange={handleChange}
              />

              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
              />

              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="doctor-preview"
                />
              )}

              <button type="submit" className="view-btn">
                {editingDoctorId ? "Update Doctor" : "Add Doctor"}
              </button>

              {editingDoctorId && (
                <button
                  type="button"
                  className="delete-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search doctor by name or specialization..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentDoctors.length > 0 ? (
                  currentDoctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.specialization}</td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="view-btn"
                            onClick={() => editDoctor(doctor)}
                          >
                            <FaEdit /> Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteDoctor(doctor._id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No doctors registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;
