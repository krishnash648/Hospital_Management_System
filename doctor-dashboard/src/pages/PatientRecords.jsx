import { useEffect, useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorNavbar from "../components/DoctorNavbar";
import API from "../services/api";
import { toast } from "react-toastify";

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await API.get("/doctors/my-appointments");

        const uniquePatientsMap = {};

        data.forEach((appointment) => {
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

    fetchPatients();
  }, []);

  return (
    <section className="dashboard-layout">
      <DoctorSidebar />

      <div className="dashboard-main">
        <DoctorNavbar />

        <div className="dashboard-content">
          <div className="page-header">
            <h1>Patient Records</h1>
            <p>View all patients assigned to you.</p>
          </div>

          <div className="appointments-table-wrapper">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Total Visits</th>
                  <th>Latest Visit</th>
                </tr>
              </thead>

              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient._id}>
                      <td className="patient-name">{patient.name}</td>
                      <td className="patient-email">{patient.email}</td>
                      <td>{patient.department}</td>
                      <td>
                        <span className="visit-badge">
                          {patient.visits} Visits
                        </span>
                      </td>
                      <td className="latest-visit">
                        {patient.latestVisit?.split("T")[0]}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No patient records found.</td>
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
