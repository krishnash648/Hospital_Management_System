import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import { toast } from "react-toastify";

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: appointments } = await API.get(
          "/doctors/my-appointments",
        );
        const { data: reportData } = await API.get("/doctors/reports");
        const { data: prescriptionData } = await API.get(
          "/doctors/prescriptions",
        );

        setReports(reportData);
        setPrescriptions(prescriptionData);

        const uniquePatientsMap = {};

        appointments.forEach((appointment) => {
          const patient = appointment.patient;

          if (!patient?._id) return;

          if (!uniquePatientsMap[patient._id]) {
            uniquePatientsMap[patient._id] = {
              ...patient,
              department: appointment.department,
              visits: 1,
              latestVisit: appointment.date,
            };
          } else {
            uniquePatientsMap[patient._id].visits += 1;

            if (
              new Date(appointment.date) >
              new Date(uniquePatientsMap[patient._id].latestVisit)
            ) {
              uniquePatientsMap[patient._id].latestVisit = appointment.date;
            }
          }
        });

        setPatients(Object.values(uniquePatientsMap));
      } catch (error) {
        console.log(error);
        toast.error("Failed to load patient records");
      }
    };

    fetchData();
  }, []);

  const getPatientReportsCount = (patientId) =>
    reports.filter((report) => report.patient?._id === patientId).length;

  const getPatientPrescriptionsCount = (patientId) =>
    prescriptions.filter(
      (prescription) => prescription.patient?._id === patientId,
    ).length;

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Patient Records</h1>
            <p>View complete patient medical records.</p>
          </div>

          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Total Visits</th>
                  <th>Reports</th>
                  <th>Prescriptions</th>
                  <th>Latest Visit</th>
                </tr>
              </thead>

              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient._id}>
                      <td>{patient.name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.department}</td>

                      <td>
                        <span className="visit-badge">{patient.visits}</span>
                      </td>

                      <td>{getPatientReportsCount(patient._id)}</td>

                      <td>{getPatientPrescriptionsCount(patient._id)}</td>

                      <td>{patient.latestVisit?.split("T")[0]}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No patient records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientRecords;
