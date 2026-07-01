import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import AdminHome from "./pages/AdminHome";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!adminToken || role !== "admin") {
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
      localStorage.setItem("token", token);
      localStorage.setItem("adminName", name || "");
      localStorage.setItem("role", "admin");
    }
  }, [location]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AdminProtectedRoute>
              <AdminHome />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <AdminProtectedRoute>
              <Doctors />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <AdminProtectedRoute>
              <Patients />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <AdminProtectedRoute>
              <Appointments />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <AdminProtectedRoute>
              <Reports />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <AdminProtectedRoute>
              <Settings />
            </AdminProtectedRoute>
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
