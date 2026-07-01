import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Context } from "./context";
import API from "../services/api";

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("doctorToken");
      const role = localStorage.getItem("role");

      if (!token || !role) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get("/auth/me");

        setUser(data);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Token invalid:", error);

        // Only clear auth-related items, not all localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("doctorToken");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("doctorName");
        localStorage.removeItem("adminName");

        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
