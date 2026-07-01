import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaEye, FaFileMedical, FaSearch } from "react-icons/fa";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const reportsPerPage = 6;

  const fetchReports = async () => {
    try {
      const { data } = await API.get("/admin/reports");
      setReports(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadReports = async () => {
      await fetchReports();
    };

    loadReports();
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      report.title?.toLowerCase().includes(search.toLowerCase()) ||
      report.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      report.doctor?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;

  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport,
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  if (loading) {
    return (
      <section className="dashboard-layout">
        <AdminSidebar />
        <div className="dashboard-main">
          <AdminNavbar />
          <div className="dashboard-content">
            <p>Loading reports...</p>
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
              <h1>Medical Reports 📄</h1>
              <p>View and monitor all uploaded patient reports.</p>
            </div>

            <div className="hero-badge">
              <FaFileMedical />
              {reports.length} Reports
            </div>
          </div>

          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search reports by title, patient or doctor..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="reports-grid">
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <div key={report._id} className="report-card">
                  <h3>{report.title}</h3>

                  <p>
                    <strong>Patient:</strong>{" "}
                    {report.patient?.name || "Unknown"}
                  </p>

                  <p>
                    <strong>Doctor:</strong>{" "}
                    {report.doctor?.name || "Not Assigned"}
                  </p>

                  <p>
                    <strong>Date:</strong> {report.createdAt?.split("T")[0]}
                  </p>

                  <div className="report-actions">
                    <button
                      className="view-btn"
                      onClick={() =>
                        window.open(
                          `http://localhost:5000${report.fileUrl}`,
                          "_blank",
                        )
                      }
                    >
                      <FaEye /> View Report
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No reports uploaded yet.</p>
            )}
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

export default Reports;
