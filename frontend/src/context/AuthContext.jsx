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
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "patient") {
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

        localStorage.clear();
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
