import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import AuthProvider from "./context/AuthContext.jsx";

const params = new URLSearchParams(window.location.search);

const token = params.get("token");
const name = params.get("name");

if (token) {
  localStorage.clear();

  localStorage.setItem("token", token);
  localStorage.setItem("role", "patient");

  if (name) {
    localStorage.setItem("userName", name);
  }

  window.history.replaceState({}, "", "/");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
