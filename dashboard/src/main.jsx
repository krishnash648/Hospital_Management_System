import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import AuthProvider from "./context/AuthContext.jsx";

const params = new URLSearchParams(window.location.search);
const token = params.get("token");
const name = params.get("name");

if (token) {
  localStorage.setItem("token", token);
  if (name) {
    localStorage.setItem("userName", name);
  }
  localStorage.setItem("role", "patient");
  window.history.replaceState({}, document.title, "/");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
