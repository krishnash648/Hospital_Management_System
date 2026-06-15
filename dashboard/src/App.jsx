import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardHome from "./pages/DashboardHome";
import MyAppointments from "./pages/MyAppointments";
import AppointmentHistory from "./pages/AppointmentHistory";
import MedicalReports from "./pages/MedicalReports";
import Settings from "./pages/Settings";
import AIHealthAssistant from "./pages/AIHealthAssistant";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/appointments" element={<MyAppointments />} />
        <Route path="/history" element={<AppointmentHistory />} />
        <Route path="/reports" element={<MedicalReports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/assistant" element={<AIHealthAssistant />} />
      </Routes>
    </Router>
  );
}

export default App;
