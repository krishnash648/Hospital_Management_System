import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Reviews from "./pages/Reviews";
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

  if (role === "patient" && patientToken) {
    window.location.replace("http://localhost:5174/");
    return null;
  }

  if (!doctorToken || role !== "doctor") {
    window.location.replace("http://localhost:5173/login");
    return null;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const name = params.get("name");

    if (token) {
      localStorage.setItem("doctorToken", token);
      localStorage.setItem("doctorName", name || "");
      localStorage.setItem("role", "doctor");
    }
  }, [location]);

  return (
    <>
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
          path="/reviews"
          element={
            <DoctorProtectedRoute>
              <Reviews />
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
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
