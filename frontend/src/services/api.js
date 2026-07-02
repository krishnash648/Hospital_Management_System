import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("doctorToken") ||
    localStorage.getItem("adminToken");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("doctorToken");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      localStorage.removeItem("doctorName");
      localStorage.removeItem("adminName");
    }

    return Promise.reject(error);
  },
);

export default API;
