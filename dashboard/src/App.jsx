import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardHome from "./pages/DashboardHome";
import MyAppointments from "./pages/MyAppointments";
import AppointmentHistory from "./pages/AppointmentHistory";
import MedicalReports from "./pages/MedicalReports";
import Prescriptions from "./pages/Prescriptions";
import Settings from "./pages/Settings";
import AIHealthAssistant from "./pages/AIHealthAssistant";
import HealthSummary from "./pages/HealthSummary";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Strict validation: ONLY allow patients with valid token
  if (!token || role !== "patient") {
    window.location.href = "http://localhost:5173/login";
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
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <AppointmentHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MedicalReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <Prescriptions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <AIHealthAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-summary"
          element={
            <ProtectedRoute>
              <HealthSummary />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;
