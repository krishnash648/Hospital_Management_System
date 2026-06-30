import { useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import Doctors from "./pages/Doctors";
import Departments from "./pages/Departments";
import DepartmentDetails from "./pages/DepartmentDetails";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./context/context";

const App = () => {
  useContext(Context);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {/* hide navbar/footer on auth routes */}
      {(() => {
        const pathname = location.pathname;
        const hideOn = ["/login", "/register", "/forgot-password"];

        const hide =
          hideOn.includes(pathname) || pathname.startsWith("/reset-password");

        return hide ? null : <Navbar />;
      })()}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/departments" element={<Departments />} />
        <Route
          path="/departments/:department"
          element={<DepartmentDetails />}
        />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>

      {(() => {
        const pathname = location.pathname;
        const hideOn = ["/login", "/register", "/forgot-password"];

        const hide =
          hideOn.includes(pathname) || pathname.startsWith("/reset-password");

        return hide ? null : <Footer />;
      })()}
      <ToastContainer position="top-center" />
    </>
  );
};

export default App;
