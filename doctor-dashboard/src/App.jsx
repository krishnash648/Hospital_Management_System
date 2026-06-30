import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import DoctorHome from "./pages/DoctorHome";
import DoctorAppointments from "./pages/DoctorAppointments";
import PatientRecords from "./pages/PatientRecords";
import Prescriptions from "./pages/Prescriptions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorProtectedRoute = ({ children }) => {
  const doctorToken = localStorage.getItem("doctorToken");
  const patientToken = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    // If patient tries opening doctor dashboard
    if (role === "patient" && patientToken) {
      window.location.replace("http://localhost:5174/");
    }

    // If no doctor session
    if (!doctorToken || role !== "doctor") {
      window.location.replace("http://localhost:5173/login");
    }
  }, [doctorToken, patientToken, role]);

  // Prevent render while redirecting
  if (!doctorToken || role !== "doctor") {
    return null;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <DoctorProtectedRoute>
              <DoctorHome />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <DoctorProtectedRoute>
              <DoctorAppointments />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <DoctorProtectedRoute>
              <PatientRecords />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <DoctorProtectedRoute>
              <Prescriptions />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <DoctorProtectedRoute>
              <Reports />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <DoctorProtectedRoute>
              <Settings />
            </DoctorProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </Router>
  );
}

export default App;
