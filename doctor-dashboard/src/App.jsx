import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorHome from "./pages/DoctorHome";
import DoctorAppointments from "./pages/DoctorAppointments";
import PatientRecords from "./pages/PatientRecords";
import Prescriptions from "./pages/Prescriptions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DoctorHome />} />
        <Route path="/appointments" element={<DoctorAppointments />} />
        <Route path="/patients" element={<PatientRecords />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </Router>
  );
}

export default App;
