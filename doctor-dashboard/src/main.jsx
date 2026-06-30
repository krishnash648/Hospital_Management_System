import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const params = new URLSearchParams(window.location.search);

const token = params.get("token");
const name = params.get("name");

// Save doctor session from URL
if (token) {
  localStorage.clear();

  localStorage.setItem("doctorToken", token);
  localStorage.setItem("role", "doctor");

  if (name) {
    localStorage.setItem("doctorName", name);
  }

  // Clean URL after storing token
  window.history.replaceState({}, "", "/");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
