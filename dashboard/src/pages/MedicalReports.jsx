import Sidebar from "../components/Sidebar";
import { FaFileMedical, FaDownload, FaEye } from "react-icons/fa";

const MedicalReports = () => {
  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-content">
        <h1>Medical Reports</h1>
        <p>Access all your health reports and lab documents.</p>

        <div className="reports-grid">
          <div className="report-card">
            <div className="report-header">
              <FaFileMedical />
              <h3>Blood Test Report</h3>
            </div>

            <p>Doctor: Dr. Sarah Wilson</p>
            <p>Date: 12 June 2026</p>

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

          <div className="report-card">
            <div className="report-header">
              <FaFileMedical />
              <h3>MRI Scan</h3>
            </div>

            <p>Doctor: Dr. Michael Brown</p>
            <p>Date: 08 June 2026</p>

            <span className="report-status pending">Pending</span>

            <div className="report-actions">
              <button className="view-btn">
                <FaEye /> View
              </button>

              <button className="download-btn">
                <FaDownload /> Download
              </button>
            </div>
          </div>

          <div className="report-card">
            <div className="report-header">
              <FaFileMedical />
              <h3>X-Ray Report</h3>
            </div>

            <p>Doctor: Dr. Olivia White</p>
            <p>Date: 03 June 2026</p>

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
        </div>
      </div>
    </section>
  );
};

export default MedicalReports;
