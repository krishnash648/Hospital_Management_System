import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaUsers, FaTrash, FaSearch } from "react-icons/fa";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const patientsPerPage = 5;

  const fetchPatients = async () => {
    try {
      const { data } = await API.get("/admin/patients");
      setPatients(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPatients = async () => {
      await fetchPatients();
    };

    loadPatients();
  }, []);

  const deletePatient = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/user/${id}`);
      toast.success("Patient deleted successfully");
      fetchPatients();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete patient");
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.email.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;

  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient,
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  if (loading) {
    return (
      <section className="dashboard-layout">
        <AdminSidebar />
        <div className="dashboard-main">
          <AdminNavbar />
          <div className="dashboard-content">
            <p>Loading patients...</p>
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
              <h1>Manage Patients 🧑‍⚕️</h1>
              <p>View, search and manage all hospital patients.</p>
            </div>

            <div className="hero-badge">
              <FaUsers />
              {patients.length} Patients
            </div>
          </div>

          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search patient by name or email..."
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
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentPatients.length > 0 ? (
                  currentPatients.map((patient) => (
                    <tr key={patient._id}>
                      <td>{patient.name}</td>
                      <td>{patient.email}</td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => deletePatient(patient._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No patients registered yet.</td>
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

export default Patients;
