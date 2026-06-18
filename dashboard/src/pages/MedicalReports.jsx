import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import { FaFileMedical, FaDownload, FaEye } from "react-icons/fa";

const MedicalReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await API.get("/reports/my");
        setReports(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReports();
  }, []);

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          <h1>Medical Reports</h1>
          <p>Access all your health reports and lab documents.</p>

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
                    Doctor Notes:{" "}
                    {report.doctorNotes || "No doctor notes available"}
                  </p>

                  <p>Date: {new Date(report.createdAt).toLocaleDateString()}</p>

                  <span className="report-status ready">Ready</span>

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
