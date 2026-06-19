import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import { FaFileMedical, FaDownload, FaEye, FaUpload } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const MedicalReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await API.get("/appointments/my");

        const completedReports = data.filter(
          (appointment) =>
            appointment.status === "approved" ||
            appointment.status === "completed",
        );

        setReports(completedReports);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReports();
  }, []);

  const handleFileUpload = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const analyzeReport = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("report", selectedFile);

    try {
      setLoading(true);

      const { data } = await API.post("/report-analysis/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysis(data.analysis);
    } catch (error) {
      console.log(error);
      setAnalysis("Failed to analyze report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          <h1>Medical Reports</h1>
          <p>Access all your health reports and lab documents.</p>

          {/* Upload Section */}
          <div className="report-upload-box">
            <h2>Upload Report for AI Analysis</h2>

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
            />

            <button
              className="upload-btn"
              onClick={analyzeReport}
              disabled={loading}
            >
              <FaUpload /> {loading ? "Analyzing..." : "Analyze Report"}
            </button>
          </div>

          {/* AI Analysis Result */}
          {analysis && (
            <div className="report-analysis-box">
              <h2>AI Analysis Result</h2>

              <div className="analysis-content">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Existing Reports */}
          <div className="reports-grid">
            {reports.length === 0 ? (
              <p>No medical reports found.</p>
            ) : (
              reports.map((report) => (
                <div className="report-card" key={report._id}>
                  <div className="report-header">
                    <FaFileMedical />
                    <h3>{report.department} Report</h3>
                  </div>

                  <p>Doctor: {report.doctor?.name || "Doctor not assigned"}</p>

                  <p>Date: {report.date?.split("T")[0]}</p>

                  <span className="report-status ready">{report.status}</span>

                  <div className="report-actions">
                    <button className="view-btn">
                      <FaEye /> View
                    </button>

                    <button className="download-btn">
                      <FaDownload /> Download
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicalReports;
