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
  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: reportData } = await API.get("/report-analysis/my");
        setReports(reportData);

        const { data: appointments } = await API.get("/appointments/my");

        const activeAppointment = appointments.find(
          (appointment) =>
            appointment.status === "approved" ||
            appointment.status === "completed",
        );

        if (activeAppointment?.doctor?._id) {
          setDoctorId(activeAppointment.doctor._id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleFileUpload = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const analyzeReport = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("report", selectedFile);
    formData.append("doctorId", doctorId);

    try {
      setLoading(true);

      const { data } = await API.post("/report-analysis/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysis(data.analysis);

      const updatedReports = await API.get("/report-analysis/my");
      setReports(updatedReports.data);

      setSelectedFile(null);
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

          {/* Upload */}
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

          {/* Latest Analysis */}
          {analysis && (
            <div className="report-analysis-box">
              <h2>Latest AI Analysis</h2>

              <div className="analysis-content">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Reports */}
          <div className="reports-grid">
            {reports.length === 0 ? (
              <p>No medical reports found.</p>
            ) : (
              reports.map((report) => (
                <div className="report-card" key={report._id}>
                  <div className="report-header">
                    <FaFileMedical />
                    <h3>{report.title}</h3>
                  </div>

                  <p>
                    <strong>Doctor:</strong>{" "}
                    {report.doctor?.name || "Doctor not assigned"}
                  </p>

                  <p>
                    <strong>Date:</strong> {report.createdAt?.split("T")[0]}
                  </p>

                  <p>
                    <strong>Doctor Notes:</strong>{" "}
                    {report.doctorNotes || "No notes yet"}
                  </p>

                  {/* Stored AI Analysis */}
                  <div className="analysis-content">
                    <strong>AI Analysis:</strong>
                    <ReactMarkdown>
                      {report.analyzedResult || "No analysis found"}
                    </ReactMarkdown>
                  </div>

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

                    <a href={`http://localhost:5000${report.fileUrl}`} download>
                      <button className="download-btn">
                        <FaDownload /> Download
                      </button>
                    </a>
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
