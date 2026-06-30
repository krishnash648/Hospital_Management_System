import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import API from "../services/api";
import { FaPrescriptionBottleAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { data } = await API.get("/prescriptions/my");
        setPrescriptions(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load prescriptions");
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <section className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <DashboardNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>My Prescriptions</h1>
            <p>View all prescriptions provided by your doctors.</p>
          </div>

          <div className="reports-grid">
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <div key={prescription._id} className="report-card">
                  <div className="report-header">
                    <FaPrescriptionBottleAlt />
                    <h3>{prescription.medicineName}</h3>
                  </div>

                  <p>
                    <strong>Doctor:</strong>{" "}
                    {prescription.doctor?.name || "Unknown"}
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

                  <p>
                    <strong>Date:</strong>{" "}
                    {prescription.createdAt?.split("T")[0]}
                  </p>
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
