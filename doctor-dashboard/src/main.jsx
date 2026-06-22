import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const params = new URLSearchParams(window.location.search);

const token = params.get("token");
const name = params.get("name");

console.log("URL TOKEN:", token);
console.log("URL NAME:", name);

if (token) {
  localStorage.setItem("doctorToken", token);
}

if (name) {
  localStorage.setItem("doctorName", name);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
