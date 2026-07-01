import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const params = new URLSearchParams(window.location.search);

const token = params.get("token");
const name = params.get("name");

// Save admin session
if (token) {
  localStorage.setItem("token", token); // FIXED
  localStorage.setItem("role", "admin");
}

if (name) {
  localStorage.setItem("adminName", name);
}

// Clean URL
if (token || name) {
  window.history.replaceState({}, "", "/");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
