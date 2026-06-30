import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaFileMedical, FaEye, FaSave } from "react-icons/fa";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [notes, setNotes] = useState({});

  const fetchReports = async () => {
    try {
      const { data } = await API.get("/doctors/reports");
      setReports(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load reports");
    }
  };

  useEffect(() => {
    const loadReports = async () => {
      await fetchReports();
    };

    loadReports();
  }, []);

  const saveDoctorNotes = async (reportId) => {
    try {
      await API.put(`/doctors/reports/${reportId}/notes`, {
        doctorNotes: notes[reportId],
      });

      toast.success("Doctor notes saved");
      fetchReports();
    } catch (error) {
      console.log(error);
      toast.error("Failed to save notes");
    }
  };

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Medical Reports</h1>
            <p>Review patient reports and add doctor notes.</p>
          </div>

          <div className="reports-grid">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report._id} className="report-card">
                  <div className="report-header">
                    <FaFileMedical />
                    <h3>{report.title}</h3>
                  </div>

                  <p>
                    <strong>Patient:</strong>{" "}
                    {report.patient?.name || "Unknown"}
                  </p>

                  <p>
                    <strong>Uploaded:</strong>{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Current Notes:</strong>{" "}
                    {report.doctorNotes || "No notes yet"}
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
                      <FaEye /> View
                    </button>
                  </div>

                  <textarea
                    placeholder="Write doctor notes..."
                    value={notes[report._id] || ""}
                    onChange={(e) =>
                      setNotes({
                        ...notes,
                        [report._id]: e.target.value,
                      })
                    }
                    className="report-notes"
                  />

                  <button
                    className="save-btn"
                    onClick={() => saveDoctorNotes(report._id)}
                  >
                    <FaSave /> Save Notes
                  </button>
                </div>
              ))
            ) : (
              <p>No reports found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reports;
